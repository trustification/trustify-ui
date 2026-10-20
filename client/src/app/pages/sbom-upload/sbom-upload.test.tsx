import { render, screen } from "@testing-library/react";
import { type MockedFunction, describe, expect, it, vi } from "vitest";

import { MemoryRouter } from "react-router-dom";

import { ReadOnlyContext } from "@app/components/ReadOnlyContext";
import { useUploadSBOM } from "@app/queries/sboms";

import { SbomUpload } from "./sbom-upload";

vi.mock("@app/queries/sboms");

const mockedUseUploadSBOM = useUploadSBOM as MockedFunction<
  typeof useUploadSBOM
>;

const renderPage = () => {
  mockedUseUploadSBOM.mockReturnValue({
    uploads: new Map(),
    handleUpload: vi.fn(),
    handleRemoveUpload: vi.fn(),
  } as unknown as ReturnType<typeof useUploadSBOM>);

  return render(
    <MemoryRouter>
      <ReadOnlyContext.Provider
        value={{ isLoading: false, areMutationsDisabled: false }}
      >
        <SbomUpload />
      </ReadOnlyContext.Provider>
    </MemoryRouter>,
  );
};

describe("SbomUpload", () => {
  it("lists CycloneDX 1.7 among the accepted versions", () => {
    renderPage();

    expect(
      screen.getByText(/CycloneDX versions 1\.3, 1\.4, 1\.5, 1\.6 and 1\.7/),
    ).toBeInTheDocument();
  });
});
