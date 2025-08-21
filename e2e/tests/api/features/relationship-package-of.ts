import { expect, test } from "../fixtures";

// The testing of CDX and SPDX is not 1 to 1, as there weren't good data available at the time of writing this test.
// But there isn't, strictly speaking, anything wrong with referring to nodes by other values than Purl or CPE.
const cdxProductCpe = "cpe:/o:redhat:enterprise_linux:8:*:baseos:*";
const cdxProductCpeNoSpecialChars =
  "cpe:/o:redhat:enterprise_linux:8.10::baseos";
const cdxComponentPurl = "pkg:rpm/redhat/curl@7.61.1-34.el8_10.2?arch=src";

const spdxProductCpe = "cpe:/a:redhat:rhel_eus:9.2:*:appstream:*";
const spdxProductCpeNoSpecialChars = "cpe:/a:redhat:rhel_eus:9.2::appstream";
const spdxComponentPurl =
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-aarch64-baseos-aus-source-rpms";
// const spdxDocumentId = "https://www.redhat.com/rhel-9.2-eus.spdx.json";

// Effectively tests TC-2048 / TC-2049 - Denote relationship between Product SBOM and other SBOM.
// TODO: test.skip("Product-Component / CDX / Product SBOM provides information from component SBOM / Get with pURL", async ({ axios,}) => {});

// TODO: test.skip("Product-Component / CDX / Component SBOM provides information from product SBOM / Get with pURL", async ({ axios }) => {});

test("Product-Component / CDX / Product SBOM provides information from component SBOM / Get with CPE", async ({
  axios,
}) => {
  const urlEncodedProductCpe = encodeURIComponent(cdxProductCpeNoSpecialChars);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedProductCpe}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        cpe: expect.arrayContaining([cdxProductCpe]),
        descendants: expect.arrayContaining([
          expect.objectContaining({
            purl: expect.arrayContaining([cdxComponentPurl]),
            relationship: "generates",
            descendants: expect.arrayContaining([
              expect.objectContaining({
                name: cdxComponentPurl,
                relationship: "package",
              }),
            ]),
          }),
        ]),
      }),
    ]),
  );
});

// TODO: test.skip("Product-Component / CDX / Component SBOM provides information from product SBOM / Get with CPE", async ({ axios }) => {});

// TODO: test.skip("Product-Component / CDX / Product SBOM provides information from product SBOM / Get with query", async ({ axios }) => {});

// TODO: test.skip("Product-Component / CDX / Component SBOM provides information from product SBOM / Get with query", async ( axios }) => {});

// TODO: test.skip("Product-Component / SPDX / Product SBOM provides information from component SBOM / Get with pURL", async ({ axios }) => {});

test("Product-Component / SPDX / Product SBOM provides information from component SBOM / Get with CPE", async ({
  axios,
}) => {
  const urlEncodedProductCpe = encodeURIComponent(spdxProductCpeNoSpecialChars);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedProductCpe}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        cpe: expect.arrayContaining([spdxProductCpe]),
        // document_id: spdxDocumentId,
        descendants: expect.arrayContaining([
          expect.objectContaining({
            purl: expect.arrayContaining([spdxComponentPurl]),
            relationship: "package",
          }),
        ]),
      }),
    ]),
  );
});

test.skip("Product-Component / SPDX / Component SBOM provides information from product SBOM / Get with Purl", async ({
  axios,
}) => {
  const urlEncodedComponentPurl = encodeURIComponent(spdxComponentPurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedComponentPurl}?ancestors=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxComponentPurl]),
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            cpe: expect.arrayContaining([spdxProductCpe]),
            // document_id: spdxDocumentId,
            relationship: "package",
          }),
        ]),
      }),
    ]),
  );
});

// TODO: test.skip("Product-Component / SPDX / Component SBOM provides information from product SBOM / Get with CPE", async ({ axios }) => {});

// TODO: test.skip("Product-Component / SPDX / Product SBOM provides information from product SBOM / Get with query", async ({ axios }) => {});

// TODO: test.skip("Product-Component / SPDX / Component SBOM provides information from product SBOM / Get with query", async ({ axios }) => {});
