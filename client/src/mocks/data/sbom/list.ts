// import sbom1 from "./sbom1.json";
// import sbom2 from "./sbom2.json";

export const sbomList = {
  advisories: [
    {
      uuid: "advisory1",
      // sboms: [sbom1, sbom2],
      sboms: [],
    },
  ],
  summary: {
    total: 2,
    status: {
      affected: 2,
      fixed: 1,
      known_not_affected: 0,
      not_affected: 0,
    },
  },
};
