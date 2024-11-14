import { http, HttpResponse } from "msw";
import { sbomsPopulated } from "./data/sboms/populated";
import { vulnerabilitiesPopulated } from "./data/vulnerabilities/populated";
import getCves from "@mocks/data/cves/list/01.json";

const sbomsHandlers = [
  http.get("/api/v1/sbom/urn%3Auuid%3A:id", ({ params }) => {
    console.log("intercepted request for SBOM: ", params);
    return HttpResponse.json(sbomsPopulated);
  }),
  // http.get(
  //   "/api/v1/sbom/urn%3Auuid%3A0193013f-1b8a-7152-8857-8b8f4238b8ba",
  //   () => {
  //     return HttpResponse.json(sbom2);
  //   }
  // ),
  // http.get(
  //   "/api/v1/sbom/urn%3Auuid%3A0193013f-0f00-77e1-afe4-b7d7f8585b7a",
  //   () => {
  //     return HttpResponse.json(sbom1);
  //   }
  // ),
  // http.get(
  //   "/api/v1/sbom/urn%3Auuid%3A0193013f-1b8a-7152-8857-8b8f4238b8ba",
  //   () => {
  //     return HttpResponse.json(sbom2);
  //   }
  // ),
];

const vulnerabilitiesHandlers = [
  http.get("/api/v1/vulnerability", ({ request }) => {
    // construct a URL instance out of the intercepted request
    const url = new URL(request.url);

    // Read the "id" URL query parameter using the "URLSearchParams" API.
    // Given "/vulnerability?id=1", "vulnerabilityId" will equal "1".
    // const vulnerabilityId = url.searchParams.get("id");
    const limit = url.searchParams.get("limit");
    console.log("limit: ", limit);

    // Note that query parameters are potentially undefined.
    // Make sure to account for that in your handlers.
    // if (!vulnerabilityId) {
    //   return new HttpResponse(null, { status: 404 });
    // }

    // return HttpResponse.json({ vulnerabilityId });
    // return HttpResponse.json(getCve);
    return HttpResponse.json(getCves);
  }),
  http.get("/api/v1/vulnerability/:id", ({ params }) => {
    const { id } = params;

    if (!id) {
      return new HttpResponse(null, { status: 404 });
    }

    if (id === "CVE-XXXXX") {
      return HttpResponse.json({ vulnerabilitiesPopulated });
    }

    return new HttpResponse(null, { status: 404 });
  }),
];

// handlers for named imports
export { sbomsHandlers, vulnerabilitiesHandlers };

// combined handlers
export const handlers = [...sbomsHandlers, ...vulnerabilitiesHandlers];
