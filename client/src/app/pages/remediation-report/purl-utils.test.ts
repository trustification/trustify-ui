import { describe, expect, it } from "vitest";

import { extractName, extractVersion } from "./purl-utils";

describe("extractName", () => {
  it("extracts the package name from a standard maven PURL", () => {
    expect(extractName("pkg:maven/org.example/commons-compress@1.21.0")).toBe(
      "commons-compress",
    );
  });

  it("extracts the package name from a PURL with no namespace", () => {
    expect(extractName("pkg:npm/lodash@4.17.21")).toBe("lodash");
  });

  it("falls back to the full PURL when there is no @ separator", () => {
    const malformed = "not-a-purl";
    expect(extractName(malformed)).toBe(malformed);
  });
});

describe("extractVersion", () => {
  it("extracts the version from a standard PURL", () => {
    expect(extractVersion("pkg:maven/org.example/log4j-core@2.14.0")).toBe(
      "2.14.0",
    );
  });

  it("strips PURL qualifiers from the version", () => {
    expect(
      extractVersion(
        "pkg:maven/org.apache.commons/commons-compress@1.21.0.redhat-00001?repository_url=https://maven.redhat.com&type=jar",
      ),
    ).toBe("1.21.0.redhat-00001");
  });

  it("returns an empty string when there is no @ separator", () => {
    expect(extractVersion("not-a-purl")).toBe("");
  });
});
