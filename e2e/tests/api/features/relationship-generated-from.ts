import { expect, test } from "../fixtures";

const cdxSourcePurl = "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src";
const cdxBinaryPurl = "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=x86_64";
const cdxDocumentId = "urn:uuid:a4f16b62-fea9-42c1-8365-d72d3cef37d1/1";

const spdxSourcePurl = "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src";
const spdxBinaryPurl = "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=x86_64";
const spdxDocumentId =
  "https://www.redhat.com/openssl-3.0.7-18.el9_2.spdx.json";

// Effectively tests TC-2050 / TC-2051 - Denote src to binary rpm relationship.
test("Generated from / CDX / Source has descendants that include binaries / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedSourcePurl = encodeURIComponent(cdxSourcePurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedSourcePurl}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([cdxSourcePurl]),
        document_id: cdxDocumentId,
        descendants: expect.arrayContaining([
          expect.objectContaining({
            relationship: "generates",
            purl: expect.arrayContaining([cdxBinaryPurl]),
          }),
        ]),
      }),
    ]),
  );
});

test("Generated from / CDX / Binary has ancestors that include the source / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedBinaryPurl = encodeURIComponent(cdxBinaryPurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedBinaryPurl}?ancestors=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([cdxBinaryPurl]),
        document_id: cdxDocumentId,
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            relationship: "generates",
            purl: expect.arrayContaining([cdxSourcePurl]),
          }),
        ]),
      }),
    ]),
  );
});

test("Generated from / SPDX / Source has descendants that include binaries / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedSourcePurl = encodeURIComponent(spdxSourcePurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedSourcePurl}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxSourcePurl]),
        document_id: spdxDocumentId,
        descendants: expect.arrayContaining([
          expect.objectContaining({
            relationship: "generates",
            purl: expect.arrayContaining([spdxBinaryPurl]),
          }),
        ]),
      }),
    ]),
  );
});

test("Generated from / SPDX / Binary has ancestors that include the source / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedBinaryPurl = encodeURIComponent(spdxBinaryPurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedBinaryPurl}?ancestors=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxBinaryPurl]),
        document_id: spdxDocumentId,
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            relationship: "generates",
            purl: expect.arrayContaining([spdxSourcePurl]),
          }),
        ]),
      }),
    ]),
  );
});
