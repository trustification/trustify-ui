import { expect, test } from "../fixtures";

// Effectively tests TC-2054 / TC-2055 - Denote upstream relationship.

const cdxUpstreamPurl =
  "pkg:generic/openssl@3.0.7?checksum=SHA-512:1aea183b0b6650d9d5e7ba87b613bb1692c71720b0e75377b40db336b40bad780f7e8ae8dfb9f60841eeb4381f4b79c4c5043210c96e7cb51f90791b80c8285e&download_url=https://pkgs.devel.redhat.com/repo/openssl/openssl-3.0.7-hobbled.tar.gz/sha512/1aea183b0b6650d9d5e7ba87b613bb1692c71720b0e75377b40db336b40bad780f7e8ae8dfb9f60841eeb4381f4b79c4c5043210c96e7cb51f90791b80c8285e/openssl-3.0.7-hobbled.tar.gz";
const cdxDownstreamPurl = "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src";
const spdxUpstreamPurl = "pkg:generic/upstream-component@0.0.0?arch=src";
const spdxDownstreamPurl = "pkg:rpm/redhat/B@0.0.0";

const query = "openssl";

test("Ancestor of / CDX / Upstream component has descendants that include downstream component / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedUpstreamPurl = encodeURIComponent(cdxUpstreamPurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedUpstreamPurl}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([cdxUpstreamPurl]),
        descendants: expect.arrayContaining([
          expect.objectContaining({
            relationship: "ancestor_of",
            purl: expect.arrayContaining([cdxDownstreamPurl]),
          }),
        ]),
      }),
    ]),
  );
});

// This should theoretically be possible, too, but I didn't manage to get it to work.
test.skip("Ancestor of / CDX / Upstream component has descendants that include downstream component / Get with query", async ({
  axios,
}) => {
  const response = await axios.get(
    `/api/v2/analysis/component?q=${query}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([cdxUpstreamPurl]),
        descendants: expect.arrayContaining([
          expect.objectContaining({
            relationship: "ancestor_of",
            purl: expect.arrayContaining([cdxDownstreamPurl]),
          }),
        ]),
      }),
    ]),
  );
});

test("Ancestor of / CDX / Downstream component has ancestors that include upstream component / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedDownstreamPurl = encodeURIComponent(cdxDownstreamPurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedDownstreamPurl}?ancestors=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([cdxDownstreamPurl]),
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            relationship: "ancestor_of",
            purl: expect.arrayContaining([cdxUpstreamPurl]),
          }),
        ]),
      }),
    ]),
  );
});

// This should theoretically be possible, too, but I didn't manage to get it to work.
test.skip("Ancestor of / CDX / Downstream component has ancestors that include upstream component / Get with query", async ({
  axios,
}) => {
  const response = await axios.get(
    `/api/v2/analysis/component?q=${query}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([cdxDownstreamPurl]),
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            relationship: "ancestor_of",
            purl: expect.arrayContaining([cdxUpstreamPurl]),
          }),
        ]),
      }),
    ]),
  );
});

test("Ancestor of / SPDX / Upstream component has descendants that include downstream component / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedUpstreamPurl = encodeURIComponent(spdxUpstreamPurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedUpstreamPurl}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxUpstreamPurl]),
        descendants: expect.arrayContaining([
          expect.objectContaining({
            relationship: "ancestor_of",
            purl: expect.arrayContaining([spdxDownstreamPurl]),
          }),
        ]),
      }),
    ]),
  );
});

// This should theoretically be possible, too, but I didn't manage to get it to work.
test.skip("Ancestor of / SPDX / Upstream component has descendants that include downstream component / Get with query", async ({
  axios,
}) => {
  const response = await axios.get(
    `/api/v2/analysis/component?q=${query}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxUpstreamPurl]),
        descendants: expect.arrayContaining([
          expect.objectContaining({
            relationship: "ancestor_of",
            purl: expect.arrayContaining([spdxDownstreamPurl]),
          }),
        ]),
      }),
    ]),
  );
});

test("Ancestor of / SPDX / Downstream component has ancestors that include upstream component / Get with pURL", async ({
  axios,
}) => {
  const urlEncodedDownstreamPurl = encodeURIComponent(spdxDownstreamPurl);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedDownstreamPurl}?ancestors=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxDownstreamPurl]),
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            relationship: "ancestor_of",
            purl: expect.arrayContaining([spdxUpstreamPurl]),
          }),
        ]),
      }),
    ]),
  );
});

// This should theoretically be possible, too, but I didn't manage to get it to work.
test.skip("Ancestor of / SPDX / Downstream component has ancestors that include upstream component / Get with query", async ({
  axios,
}) => {
  const response = await axios.get(
    `/api/v2/analysis/component?q=${query}?descendants=10`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining([spdxDownstreamPurl]),
        ancestors: expect.arrayContaining([
          expect.objectContaining({
            relationship: "ancestor_of",
            purl: expect.arrayContaining([spdxUpstreamPurl]),
          }),
        ]),
      }),
    ]),
  );
});
