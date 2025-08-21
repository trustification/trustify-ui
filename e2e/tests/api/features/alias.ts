import { expect, test } from "../fixtures";

const opensslPurl = ["pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src"];

const opensslPurlAliases = [
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-aarch64-baseos-aus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-i686-baseos-aus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-aarch64-baseos-e4s-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-s390x-baseos-eus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-s390x-baseos-aus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-i686-baseos-e4s-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-ppc64le-baseos-eus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-x86_64-baseos-eus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-ppc64le-baseos-aus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-s390x-baseos-e4s-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-x86_64-baseos-e4s-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-ppc64le-baseos-e4s-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-i686-baseos-eus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-aarch64-baseos-eus-source-rpms",
  "pkg:rpm/redhat/openssl@3.0.7-18.el9_2?arch=src&repository_id=rhel-9-for-x86_64-baseos-aus-source-rpms",
];

// TODO: Rename when we get an appropriate SBOM with CPE aliases.
const componentCpe = ["cpe:/a:redhat:quarkus:2.13:*:el8:*"];

const componentCpeAliases: string[] = [];

test("Alias / Get aliases by pURL", async ({ axios }) => {
  var urlEncodedPurl = encodeURIComponent(opensslPurl[0]);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedPurl}`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining(opensslPurl.concat(opensslPurlAliases)),
      }),
    ]),
  );
});

test("Alias / Get aliases by pURL alias", async ({ axios }) => {
  var urlEncodedPurlAlias = encodeURIComponent(opensslPurlAliases[0]);

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedPurlAlias}`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining(opensslPurl.concat(opensslPurlAliases)),
      }),
    ]),
  );
});

test("Alias / Get aliases by CPE", async ({ axios }) => {
  // We currently don't have a suitable SBOM for this. At most we can verify that the CPE field is an array, which wasn't the case before this feature was implemented.
  var urlEncodedCpe = encodeURIComponent("cpe:/a:redhat:quarkus:2.13::el8");

  const response = await axios.get(
    `/api/v2/analysis/component/${urlEncodedCpe}`,
  );

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        cpe: expect.arrayContaining(componentCpe.concat(componentCpeAliases)),
      }),
    ]),
  );
});

// TODO: test.skip("Alias / Get aliases by CPE alias", async ({ axios }) => {});

test.skip("Alias / Get aliases by query", async ({ axios }) => {
  const response = await axios.get(`/api/v2/analysis/component?q=rhel`);

  expect(response.data.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        purl: expect.arrayContaining(opensslPurlAliases),
      }),
    ]),
  );
});
