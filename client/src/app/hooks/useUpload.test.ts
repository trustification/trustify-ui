import { act, renderHook } from "@testing-library/react";
import {
  AxiosError,
  AxiosHeaders,
  type AxiosPromise,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { describe, expect, it, vi } from "vitest";

import { FORM_DATA_FILE_KEY } from "@app/Constants";

import { useUpload } from "./useUpload";

type UploadFn = (
  form: FormData,
  requestConfig: AxiosRequestConfig,
) => AxiosPromise<string>;

const createResponse = (data: string): AxiosResponse<string> => ({
  data,
  status: 201,
  statusText: "Created",
  headers: {},
  config: { headers: new AxiosHeaders() },
});

const createAxiosError = (message: string): AxiosError<string> =>
  new AxiosError<string>(message, "ERR_BAD_REQUEST");

const fileOf = (form: FormData) => form.get(FORM_DATA_FILE_KEY) as File;

/** Returns the nth recorded call to uploadFn, failing the test if it was never made. */
const nthCall = (uploadFn: UploadFn, index: number) => {
  const call = vi.mocked(uploadFn).mock.calls[index];
  if (!call) {
    throw new Error(`uploadFn was not called ${index + 1} time(s)`);
  }
  return { form: call[0], config: call[1] };
};

/** Flushes the microtask queue so fire-and-forget promise chains settle before assertions. */
const flushPromises = () => act(() => new Promise((r) => setTimeout(r, 0)));

const fileA = new File(["a-contents"], "a.json", { type: "application/json" });
const fileB = new File(["b-contents"], "b.json", { type: "application/json" });

describe("useUpload", () => {
  /**
   * Pins that every accepted file is uploaded exactly once, that each request's
   * FormData carries that same file under FORM_DATA_FILE_KEY, and that each file
   * is queued in the uploads map in the order it was accepted.
   */
  it("should upload every accepted file with that file in its FormData", () => {
    // Given an uploadFn whose promise never settles, so state stays at "queued"
    const uploadFn = vi.fn(() => new Promise(() => {})) as unknown as UploadFn;
    const { result } = renderHook(() =>
      useUpload<string, string>({ parallel: true, uploadFn }),
    );

    // When uploading two files
    act(() => {
      result.current.handleUpload([fileA, fileB]);
    });

    // Then one request per file, each carrying its own file
    expect(uploadFn).toHaveBeenCalledTimes(2);
    expect(fileOf(nthCall(uploadFn, 0).form)).toBe(fileA);
    expect(fileOf(nthCall(uploadFn, 1).form)).toBe(fileB);

    // And both files are queued, keyed by the File objects themselves
    expect([...result.current.uploads.keys()]).toEqual([fileA, fileB]);
    expect(result.current.uploads.get(fileA)?.status).toBe("queued");
    expect(result.current.uploads.get(fileB)?.status).toBe("queued");
    expect(result.current.uploads.get(fileA)?.cancelFn).toBeDefined();
    expect(result.current.uploads.get(fileB)?.cancelFn).toBeDefined();
  });

  /**
   * Pins that the onUploadProgress handler built for a given file dispatches
   * progress against that same file (and not, say, against the last file of the batch).
   */
  it("should report upload progress against the file that produced it", () => {
    // Given two in-flight uploads
    const uploadFn = vi.fn(() => new Promise(() => {})) as unknown as UploadFn;
    const { result } = renderHook(() =>
      useUpload<string, string>({ parallel: true, uploadFn }),
    );
    act(() => {
      result.current.handleUpload([fileA, fileB]);
    });

    // When the second request reports 25% progress
    const secondConfig = nthCall(uploadFn, 1).config;
    act(() => {
      secondConfig.onUploadProgress?.({
        loaded: 25,
        total: 100,
      } as Parameters<NonNullable<AxiosRequestConfig["onUploadProgress"]>>[0]);
    });

    // Then only the second file moves to inProgress with that progress
    expect(result.current.uploads.get(fileB)?.progress).toBe(25);
    expect(result.current.uploads.get(fileB)?.status).toBe("inProgress");
    expect(result.current.uploads.get(fileA)?.progress).toBe(0);
    expect(result.current.uploads.get(fileA)?.status).toBe("queued");
  });

  /**
   * Pins that onSuccess receives the response paired with the file that produced it,
   * and that the uploads map records that response against the same file.
   */
  it("should pass each response together with its own file to onSuccess", async () => {
    // Given an uploadFn that echoes back the name of the file it received
    const uploadFn = vi.fn((form: FormData) =>
      Promise.resolve(createResponse(`uploaded:${fileOf(form).name}`)),
    ) as unknown as UploadFn;
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpload<string, string>({ parallel: true, uploadFn, onSuccess }),
    );

    // When uploading two files
    act(() => {
      result.current.handleUpload([fileA, fileB]);
    });
    await flushPromises();

    // Then each file is reported with its matching response
    expect(onSuccess).toHaveBeenCalledTimes(2);
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ data: "uploaded:a.json" }),
      fileA,
    );
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ data: "uploaded:b.json" }),
      fileB,
    );

    // And the uploads map holds the same pairing
    expect(result.current.uploads.get(fileA)?.status).toBe("complete");
    expect(result.current.uploads.get(fileA)?.response?.data).toBe(
      "uploaded:a.json",
    );
    expect(result.current.uploads.get(fileB)?.response?.data).toBe(
      "uploaded:b.json",
    );
  });

  /**
   * Pins the same file/response pairing for the sequential (parallel: false) code path,
   * which runs the queue through reduce instead of a plain loop.
   */
  it("should pair file and response correctly when uploading sequentially", async () => {
    // Given sequential uploads that echo the received file name
    const uploadFn = vi.fn((form: FormData) =>
      Promise.resolve(createResponse(`uploaded:${fileOf(form).name}`)),
    ) as unknown as UploadFn;
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpload<string, string>({ parallel: false, uploadFn, onSuccess }),
    );

    // When uploading two files
    act(() => {
      result.current.handleUpload([fileA, fileB]);
    });
    await flushPromises();

    // Then both complete, each paired with its own file
    expect(onSuccess.mock.calls).toEqual([
      [expect.objectContaining({ data: "uploaded:a.json" }), fileA],
      [expect.objectContaining({ data: "uploaded:b.json" }), fileB],
    ]);
  });

  /**
   * Pins that a failing upload reports the error together with its own file,
   * both to onError and into the uploads map, and is not flagged as cancelled.
   */
  it("should pass each error together with its own file to onError", async () => {
    // Given an uploadFn that fails for every file
    const uploadFn = vi.fn((form: FormData) =>
      Promise.reject(createAxiosError(`failed:${fileOf(form).name}`)),
    ) as unknown as UploadFn;
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useUpload<string, string>({ parallel: true, uploadFn, onError }),
    );

    // When uploading two files
    act(() => {
      result.current.handleUpload([fileA, fileB]);
    });
    await flushPromises();

    // Then each file is reported with its matching error
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "failed:a.json" }),
      fileA,
    );
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "failed:b.json" }),
      fileB,
    );

    // And the uploads map holds the same pairing, not flagged as cancelled
    expect(result.current.uploads.get(fileA)?.status).toBe("complete");
    expect(result.current.uploads.get(fileA)?.error?.message).toBe(
      "failed:a.json",
    );
    expect(result.current.uploads.get(fileA)?.wasCancelled).toBe(false);
    expect(result.current.uploads.get(fileB)?.error?.message).toBe(
      "failed:b.json",
    );
  });

  /**
   * Pins that a cancellation still records the error against its file and marks it
   * cancelled, but deliberately does not invoke the onError callback.
   */
  it("should record a cancelled upload against its file without calling onError", async () => {
    // Given an uploadFn that rejects with the cancellation message
    const uploadFn = vi.fn(() =>
      Promise.reject(createAxiosError("cancelled")),
    ) as unknown as UploadFn;
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useUpload<string, string>({ parallel: true, uploadFn, onError }),
    );

    // When uploading a single file
    act(() => {
      result.current.handleUpload([fileA]);
    });
    await flushPromises();

    // Then the upload is flagged as cancelled and onError is not called
    expect(result.current.uploads.get(fileA)?.status).toBe("complete");
    expect(result.current.uploads.get(fileA)?.wasCancelled).toBe(true);
    expect(onError).not.toHaveBeenCalled();
  });

  /** Pins that an empty batch performs no uploads and leaves the uploads map empty. */
  it("should do nothing when the accepted file list is empty", () => {
    // Given a hook with no uploads yet
    const uploadFn = vi.fn(() => new Promise(() => {})) as unknown as UploadFn;
    const { result } = renderHook(() =>
      useUpload<string, string>({ parallel: true, uploadFn }),
    );

    // When uploading an empty list
    act(() => {
      result.current.handleUpload([]);
    });

    // Then nothing is requested or queued
    expect(uploadFn).not.toHaveBeenCalled();
    expect(result.current.uploads.size).toBe(0);
  });
});
