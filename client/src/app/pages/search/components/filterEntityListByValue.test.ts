import { filterEntityListByValue, IEntity } from "./SearchMenu";

const arrayList: IEntity[] = [
  {
    id: "CVE-2023-24815",
    title: "CVE-2023-24815",
    description:
      "Disclosure of classpath resources on Windows when mounted on a wildcard rou",
    navLink: "/advisories/urn:uuid:d30fc342-ee13-4711-9b5d-43c5d9ea7fd3",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "CVE-2023-34454",
    title: "CVE-2023-34454",
    description:
      "snappy-java's Integer Overflow vulnerability in compress leads to DoS",
    navLink: "/advisories/urn:uuid:e2534aa1-b631-4066-9eee-7c33aa23d634",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "CVE-2023-26464",
    title: "CVE-2023-26464",
    description:
      "Apache Log4j 1.x (EOL) allows DoS in Chainsaw and SocketAppender",
    navLink: "/advisories/urn:uuid:8a456db4-2e8f-4ed4-a427-178161a94a9b",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "CVE-2023-20862",
    title: "CVE-2023-20862",
    description:
      "In Spring Security, versions 5.7.x prior to 5.7.8, versions 5.8.x prior to ",
    navLink: "/advisories/urn:uuid:4f5ccdd5-3176-4fb7-844d-34a7f1419938",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "https://www.redhat.com/#CVE-2023-1108",
    title: "https://www.redhat.com/#CVE-2023-1108",
    description: "Undertow: Infinite loop in SslConduit during close",
    navLink: "/advisories/urn:uuid:4af3ac1c-fa69-45e4-a2af-7886e0ec8300",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "CVE-2023-0481",
    title: "CVE-2023-0481",
    description:
      "In RestEasy Reactive implementation of Quarkus the insecure File.createTemp",
    navLink: "/advisories/urn:uuid:671dd85b-409f-4509-9a50-c4b2404ac10a",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "CVE-2023-20861",
    title: "CVE-2023-20861",
    description:
      "In Spring Framework versions 6.0.0 - 6.0.6, 5.3.0 - 5.3.25, 5.2.0.RELEASE -",
    navLink: "/advisories/urn:uuid:b3c691ea-96e8-4b3b-b9ef-ee7a5ec85a24",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "CVE-2023-4853",
    title: "CVE-2023-4853",
    description: "Quarkus: http security policy bypass",
    navLink: "/advisories/urn:uuid:58eec6a5-f0db-4eab-a7d9-67ca5f2595f5",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "https://www.redhat.com/#CVE-2023-33201",
    title: "https://www.redhat.com/#CVE-2023-33201",
    description:
      "bouncycastle: potential  blind LDAP injection attack using a self-signed ce",
    navLink: "/advisories/urn:uuid:84ac3e13-0a96-4c3b-9a89-6db277957ca2",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "https://www.redhat.com/#CVE-2023-4853",
    title: "https://www.redhat.com/#CVE-2023-4853",
    description: "quarkus: HTTP security policy bypass",
    navLink: "/advisories/urn:uuid:e116bbd2-840e-4254-9f5c-6f77dd7b1877",
    type: "Advisory",
    typeColor: "blue",
  },
  {
    id: "2e05fb3a-cda9-5e54-96b2-d8c7ea390f8d",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/2e05fb3a-cda9-5e54-96b2-d8c7ea390f8d",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "e0b74cfd-e0b0-512b-8814-947f868bc50e",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/e0b74cfd-e0b0-512b-8814-947f868bc50e",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "f4f6b460-82e5-59f0-a7f6-da5f226a9b24",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/f4f6b460-82e5-59f0-a7f6-da5f226a9b24",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "f357b0cc-75d5-532e-b7d9-2233f6f752c8",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/f357b0cc-75d5-532e-b7d9-2233f6f752c8",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "b9a43108-525d-59ea-bc31-ff217d4c7925",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/b9a43108-525d-59ea-bc31-ff217d4c7925",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "d6dea366-e8a6-5500-9aef-14464b717295",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/d6dea366-e8a6-5500-9aef-14464b717295",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "14c5c61d-c4cc-56fb-9db6-f62541076b80",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/14c5c61d-c4cc-56fb-9db6-f62541076b80",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "25ddc770-5fde-53a8-8451-41091d5fcb3b",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/25ddc770-5fde-53a8-8451-41091d5fcb3b",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "62c9cfab-997b-5126-ad5c-90bc277e048f",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/62c9cfab-997b-5126-ad5c-90bc277e048f",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "81293bba-1ab5-5524-8444-0bd55d19b9b3",
    title: "item.decomposedPurl ? item.decomposedPurl?.name : item.purl",
    description: "item.decomposedPurl?.namespace",
    navLink: "/packages/81293bba-1ab5-5524-8444-0bd55d19b9b3",
    type: "Package",
    typeColor: "cyan",
  },
  {
    id: "urn:uuid:01932ff3-0f06-74e0-b673-f92bac24a6b0",
    title: "ubi8-micro-container",
    description: "Organization: Red Hat Product Security (secalert@redhat.com)",
    navLink: "/sboms/urn:uuid:01932ff3-0f06-74e0-b673-f92bac24a6b0",
    type: "SBOM",
    typeColor: "purple",
  },
  {
    id: "urn:uuid:01932ff3-0f90-7e51-9c9d-1fac54a371f3",
    title: "ubi9-minimal-container",
    description: "Organization: Red Hat Product Security (secalert@redhat.com)",
    navLink: "/sboms/urn:uuid:01932ff3-0f90-7e51-9c9d-1fac54a371f3",
    type: "SBOM",
    typeColor: "purple",
  },
  {
    id: "urn:uuid:01932ff3-0f91-7543-af38-c399c1e9a923",
    title: "ubi8-minimal-container",
    description: "Organization: Red Hat Product Security (secalert@redhat.com)",
    navLink: "/sboms/urn:uuid:01932ff3-0f91-7543-af38-c399c1e9a923",
    type: "SBOM",
    typeColor: "purple",
  },
  {
    id: "urn:uuid:01932ff3-0fbc-7b82-b9c2-18044dbbb574",
    title: "ubi9-container",
    description: "Organization: Red Hat Product Security (secalert@redhat.com)",
    navLink: "/sboms/urn:uuid:01932ff3-0fbc-7b82-b9c2-18044dbbb574",
    type: "SBOM",
    typeColor: "purple",
  },
  {
    id: "urn:uuid:01932ff3-0fc4-7bf2-8201-5d5e9dc471bd",
    title: "ubi8-container",
    description: "Organization: Red Hat Product Security (secalert@redhat.com)",
    navLink: "/sboms/urn:uuid:01932ff3-0fc4-7bf2-8201-5d5e9dc471bd",
    type: "SBOM",
    typeColor: "purple",
  },
  {
    id: "urn:uuid:01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9",
    title: "quarkus-bom",
    description: "Organization: Red Hat Product Security (secalert@redhat.com)",
    navLink: "/sboms/urn:uuid:01932ff3-0fe1-7ca0-8ba6-c26de2fe81d9",
    type: "SBOM",
    typeColor: "purple",
  },
  {
    id: "CVE-2022-45787",
    title: "CVE-2022-45787",
    description:
      "Unproper laxist permissions on the temporary files used by MIME4J TempFileS",
    navLink: "/vulnerabilities/CVE-2022-45787",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-0044",
    title: "CVE-2023-0044",
    description:
      "If the Quarkus Form Authentication session cookie Path attribute is set to ",
    navLink: "/vulnerabilities/CVE-2023-0044",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-0481",
    title: "CVE-2023-0481",
    description:
      "In RestEasy Reactive implementation of Quarkus the insecure File.createTemp",
    navLink: "/vulnerabilities/CVE-2023-0481",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-0482",
    title: "CVE-2023-0482",
    description:
      "In RESTEasy the insecure File.createTempFile() is used in the DataSourcePro",
    navLink: "/vulnerabilities/CVE-2023-0482",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-1108",
    title: "CVE-2023-1108",
    description:
      "A flaw was found in undertow. This issue makes achieving a denial of servic",
    navLink: "/vulnerabilities/CVE-2023-1108",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-1370",
    title: "CVE-2023-1370",
    description:
      "[Json-smart](https://netplex.github.io/json-smart/) is a performance focuse",
    navLink: "/vulnerabilities/CVE-2023-1370",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-1436",
    title: "CVE-2023-1436",
    description:
      "An infinite recursion is triggered in Jettison when constructing a JSONArra",
    navLink: "/vulnerabilities/CVE-2023-1436",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-1584",
    title: "CVE-2023-1584",
    description:
      "A flaw was found in Quarkus. Quarkus OIDC can leak both ID and access token",
    navLink: "/vulnerabilities/CVE-2023-1584",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-1664",
    title: "CVE-2023-1664",
    description:
      "A flaw was found in Keycloak. This flaw depends on a non-default configurat",
    navLink: "/vulnerabilities/CVE-2023-1664",
    type: "CVE",
    typeColor: "orange",
  },
  {
    id: "CVE-2023-20860",
    title: "CVE-2023-20860",
    description:
      'Spring Framework running version 6.0.0 - 6.0.6 or 5.3.0 - 5.3.25 using "**"',
    navLink: "/vulnerabilities/CVE-2023-20860",
    type: "CVE",
    typeColor: "orange",
  },
];

describe("filterEntityListByValue", () => {
  it("builds an array of elements based on string provided", () => {
    const searchString = "quarkus";
    const result = filterEntityListByValue(arrayList, searchString);
    expect(result).toHaveLength(3);
  });
});
