import type { AxiosError } from "axios";

import {
  createComparator,
  decodePurl,
  getAxiosErrorMessage,
  getFilenameFromContentDisposition,
  getToolbarChipKey,
} from "./utils";

const createAxiosError = (
  overrides: Partial<AxiosError> = {},
): AxiosError<unknown> =>
  ({
    message: "Request failed with status code 400",
    isAxiosError: true,
    name: "AxiosError",
    toJSON: () => ({}),
    ...overrides,
  }) as AxiosError<unknown>;

describe("utils", () => {
  // getToolbarChipKey

  it("getToolbarChipKey: test 'string'", () => {
    const result = getToolbarChipKey("myValue");
    expect(result).toBe("myValue");
  });

  it("getToolbarChipKey: test 'ToolbarChip'", () => {
    const result = getToolbarChipKey({ key: "myKey", node: "myNode" });
    expect(result).toBe("myKey");
  });

  // getAxiosErrorMessage

  it("getAxiosErrorMessage: concatenates error and message (ErrorInformation)", () => {
    const error = createAxiosError({
      response: {
        data: { error: "InvalidFormat", message: "expected CycloneDX or SPDX" },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe(
      "InvalidFormat: expected CycloneDX or SPDX",
    );
  });

  it("getAxiosErrorMessage: includes details when error and message present", () => {
    const error = createAxiosError({
      response: {
        data: {
          error: "InvalidFormat",
          message: "could not parse document",
          details: "line 42: unexpected token",
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe(
      "InvalidFormat: could not parse document\nline 42: unexpected token",
    );
  });

  it("getAxiosErrorMessage: returns message when only message present", () => {
    const error = createAxiosError({
      response: {
        data: { message: "Invalid SBOM format" },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe("Invalid SBOM format");
  });

  it("getAxiosErrorMessage: returns error when only error present", () => {
    const error = createAxiosError({
      response: {
        data: { error: "Something went wrong" },
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe("Something went wrong");
  });

  it("getAxiosErrorMessage: returns plain string response data", () => {
    const error = createAxiosError({
      response: {
        data: "Plain text error body",
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe("Plain text error body");
  });

  it("getAxiosErrorMessage: falls back to axiosError.message", () => {
    const error = createAxiosError({
      message: "Network Error",
    });
    expect(getAxiosErrorMessage(error)).toBe("Network Error");
  });

  it("getAxiosErrorMessage: ignores unknown fields and uses error+message", () => {
    const error = createAxiosError({
      response: {
        data: {
          error: "SomeError",
          message: "Something happened",
          unknownField: "ignored",
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe("SomeError: Something happened");
  });

  it("getAxiosErrorMessage: appends finding messages from validation reports", () => {
    const error = createAxiosError({
      response: {
        data: {
          error: "ValidationRejected",
          message: "document rejected by validation",
          validation: [
            {
              validator: "scheck",
              findings: [
                { severity: "fatal", message: "missing field 'SPDXID'" },
                { severity: "error", message: "invalid package version" },
              ],
              outcome: "failed",
            },
          ],
        },
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe(
      "ValidationRejected: document rejected by validation\nmissing field 'SPDXID'\ninvalid package version",
    );
  });

  it("getAxiosErrorMessage: collects findings from multiple validation reports", () => {
    const error = createAxiosError({
      response: {
        data: {
          error: "ValidationRejected",
          message: "document rejected by validation",
          validation: [
            {
              validator: "first",
              findings: [{ severity: "fatal", message: "finding A" }],
              outcome: "failed",
            },
            {
              validator: "second",
              findings: [{ severity: "error", message: "finding B" }],
              outcome: "failed",
            },
          ],
        },
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe(
      "ValidationRejected: document rejected by validation\nfinding A\nfinding B",
    );
  });

  it("getAxiosErrorMessage: ignores validation array when findings are empty", () => {
    const error = createAxiosError({
      response: {
        data: {
          error: "ValidationRejected",
          message: "document rejected by validation",
          validation: [
            { validator: "scheck", findings: [], outcome: "failed" },
          ],
        },
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe(
      "ValidationRejected: document rejected by validation",
    );
  });

  it("getAxiosErrorMessage: prefers details string over validation findings", () => {
    const error = createAxiosError({
      response: {
        data: {
          error: "SomeError",
          message: "something went wrong",
          details: "inline detail",
          validation: [
            {
              validator: "scheck",
              findings: [{ severity: "fatal", message: "should be ignored" }],
              outcome: "failed",
            },
          ],
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as never,
      },
    });
    expect(getAxiosErrorMessage(error)).toBe(
      "SomeError: something went wrong\ninline detail",
    );
  });

  // decodePurl

  it("decodePurl: decodes percent-encoded qualifiers", () => {
    const encoded =
      "pkg:maven/org.hdrhistogram/HdrHistogram@2.1.12.redhat-00002?repository_url=https:%2F%2Fmaven.repository.redhat.com%2Fga%2F&type=jar";
    expect(decodePurl(encoded)).toBe(
      "pkg:maven/org.hdrhistogram/HdrHistogram@2.1.12.redhat-00002?repository_url=https://maven.repository.redhat.com/ga/&type=jar",
    );
  });

  it("decodePurl: returns original value for malformed URI sequences", () => {
    expect(decodePurl("pkg:%")).toBe("pkg:%");
  });

  it("decodePurl: returns empty string for null or undefined", () => {
    expect(decodePurl(null)).toBe("");
    expect(decodePurl(undefined)).toBe("");
  });

  // getFilenameFromContentDisposition

  describe("getFilenameFromContentDisposition", () => {
    it("extracts a double-quoted filename", () => {
      expect(
        getFilenameFromContentDisposition('attachment; filename="license.txt"'),
      ).toBe("license.txt");
    });

    it("extracts an unquoted filename", () => {
      expect(
        getFilenameFromContentDisposition("attachment; filename=license.txt"),
      ).toBe("license.txt");
    });

    it("stops at the closing quote when more parameters follow", () => {
      expect(
        getFilenameFromContentDisposition(
          'attachment; filename="sbom.json"; charset=utf-8',
        ),
      ).toBe("sbom.json");
    });

    it("greedily swallows trailing parameters when the filename is unquoted", () => {
      // Pins current (quirky) behaviour: without quotes the character class
      // keeps consuming until the end of the header value.
      expect(
        getFilenameFromContentDisposition(
          "attachment; filename=sbom.json; charset=utf-8",
        ),
      ).toBe("sbom.json; charset=utf-8");
    });

    it("extracts a filename containing spaces and dots", () => {
      expect(
        getFilenameFromContentDisposition(
          'attachment; filename="my report v1.2.tar.gz"',
        ),
      ).toBe("my report v1.2.tar.gz");
    });

    it("returns null when the header has no filename parameter", () => {
      expect(getFilenameFromContentDisposition("attachment")).toBeNull();
    });

    it("returns null for an empty header", () => {
      expect(getFilenameFromContentDisposition("")).toBeNull();
    });

    it("returns null for an empty quoted filename", () => {
      expect(
        getFilenameFromContentDisposition('attachment; filename=""'),
      ).toBeNull();
    });

    it("returns a string (never undefined) when a filename matches", () => {
      const result = getFilenameFromContentDisposition(
        'attachment; filename="a"',
      );
      expect(typeof result).toBe("string");
      expect(result).not.toBeUndefined();
    });
  });

  describe("createComparator", () => {
    describe("defaults (asc, en, nulls first)", () => {
      const cmp = createComparator();

      it("compares numbers arithmetically", () => {
        expect(cmp(1, 2)).toBeLessThan(0);
        expect(cmp(2, 1)).toBeGreaterThan(0);
        expect(cmp(5, 5)).toBe(0);
      });

      it("compares negative numbers", () => {
        expect(cmp(-3, 2)).toBeLessThan(0);
        expect(cmp(0, -1)).toBeGreaterThan(0);
      });

      it("compares strings alphabetically", () => {
        expect(cmp("apple", "banana")).toBeLessThan(0);
        expect(cmp("banana", "apple")).toBeGreaterThan(0);
        expect(cmp("same", "same")).toBe(0);
      });

      it("compares strings with numeric awareness", () => {
        expect(cmp("file2", "file10")).toBeLessThan(0);
        expect(cmp("item10", "item2")).toBeGreaterThan(0);
      });

      it("coerces non-number, non-string values to string", () => {
        expect(cmp(true, false)).toBeGreaterThan(0); // "true" vs "false"
        expect(cmp(false, true)).toBeLessThan(0);
      });

      it("places null before non-null values", () => {
        expect(cmp(null, "hello")).toBeLessThan(0);
        expect(cmp("hello", null)).toBeGreaterThan(0);
      });

      it("places undefined before non-null values", () => {
        expect(cmp(undefined, 42)).toBeLessThan(0);
        expect(cmp(42, undefined)).toBeGreaterThan(0);
      });

      it("treats two nullish values as equal", () => {
        expect(cmp(null, null)).toBe(0);
        expect(cmp(undefined, undefined)).toBe(0);
        expect(cmp(null, undefined)).toBe(0);
      });
    });

    describe("direction: desc", () => {
      const cmp = createComparator({ direction: "desc" });

      it("reverses numeric comparison", () => {
        expect(cmp(1, 2)).toBeGreaterThan(0);
        expect(cmp(2, 1)).toBeLessThan(0);
      });

      it("reverses string comparison", () => {
        expect(cmp("apple", "banana")).toBeGreaterThan(0);
        expect(cmp("banana", "apple")).toBeLessThan(0);
      });
    });

    describe("nulls: last", () => {
      const cmp = createComparator({ nulls: "last" });

      it("places null after non-null values", () => {
        expect(cmp(null, "hello")).toBeGreaterThan(0);
        expect(cmp("hello", null)).toBeLessThan(0);
      });

      it("places undefined after non-null values", () => {
        expect(cmp(undefined, 1)).toBeGreaterThan(0);
        expect(cmp(1, undefined)).toBeLessThan(0);
      });

      it("treats two nullish values as equal", () => {
        expect(cmp(null, undefined)).toBe(0);
      });
    });

    describe("locale option", () => {
      it("respects locale-specific ordering", () => {
        const sv = createComparator({ locale: "sv" });
        // In Swedish, ä sorts after z
        expect(sv("ä", "z")).toBeGreaterThan(0);

        const de = createComparator({ locale: "de" });
        // In German, ä sorts near a (before b)
        expect(de("ä", "b")).toBeLessThan(0);
      });
    });

    describe("sorting arrays", () => {
      it("sorts numbers ascending", () => {
        const cmp = createComparator();
        expect([3, 1, 2].sort(cmp)).toEqual([1, 2, 3]);
      });

      it("sorts numbers descending", () => {
        const cmp = createComparator({ direction: "desc" });
        expect([3, 1, 2].sort(cmp)).toEqual([3, 2, 1]);
      });

      it("sorts strings with numeric awareness", () => {
        const cmp = createComparator();
        expect(["file10", "file2", "file1"].sort(cmp)).toEqual([
          "file1",
          "file2",
          "file10",
        ]);
      });

      it("sorts with nulls first (default)", () => {
        const cmp = createComparator();
        expect([3, null, 1, null, 2].sort(cmp)).toEqual([null, null, 1, 2, 3]);
      });

      it("sorts with nulls last", () => {
        const cmp = createComparator({ nulls: "last" });
        expect([3, null, 1, null, 2].sort(cmp)).toEqual([1, 2, 3, null, null]);
      });
    });
  });
});
