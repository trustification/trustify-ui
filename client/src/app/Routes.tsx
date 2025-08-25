import type React from "react";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams, useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { ErrorFallback } from "./components/ErrorFallback";

const Home = lazy(() => import("./pages/home"));

// Advisory
const AdvisoryList = lazy(() => import("./pages/advisory-list"));
const AdvisoryDetails = lazy(() => import("./pages/advisory-details"));

// Vulnerability
const VulnerabilityList = lazy(() => import("./pages/vulnerability-list"));
const VulnerabilityDetails = lazy(
  () => import("./pages/vulnerability-details"),
);

// Package
const PackageList = lazy(() => import("./pages/package-list"));
const PackageDetails = lazy(() => import("./pages/package-details"));

// SBOM
const SBOMList = lazy(() => import("./pages/sbom-list"));
const SBOMDetails = lazy(() => import("./pages/sbom-details"));

// Others
const Search = lazy(() => import("./pages/search"));
const ImporterList = lazy(() => import("./pages/importer-list"));
const Upload = lazy(() => import("./pages/upload"));

export enum PathParam {
  ADVISORY_ID = "advisoryId",
  VULNERABILITY_ID = "vulnerabilityId",
  SBOM_ID = "sbomId",
  PACKAGE_ID = "packageId",
}

export const Paths = {
  advisories: "/advisories",
  advisoryDetails: `/advisories/:${PathParam.ADVISORY_ID}`,
  vulnerabilities: "/vulnerabilities",
  vulnerabilityDetails: `/vulnerabilities/:${PathParam.VULNERABILITY_ID}`,
  sboms: "/sboms",
  sbomDetails: `/sboms/:${PathParam.SBOM_ID}`,
  packages: "/packages",
  packageDetails: `/packages/:${PathParam.PACKAGE_ID}`,
  search: "/search",
  importers: "/importers",
  upload: "/upload",
} as const;

const Lazy = ({ component }: { component: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      {component}
    </Suspense>
  );
};

export const AppRoutes = () => {
  const allRoutes = useRoutes([
    { path: "/", element: <Lazy component={<Home />} /> },
    { path: Paths.advisories, element: <Lazy component={<AdvisoryList />} /> },
    {
      path: Paths.advisoryDetails,
      element: <Lazy component={<AdvisoryDetails />} />,
    },
    {
      path: Paths.vulnerabilities,
      element: <Lazy component={<VulnerabilityList />} />,
    },
    {
      path: Paths.vulnerabilityDetails,
      element: <Lazy component={<VulnerabilityDetails />} />,
    },
    { path: Paths.packages, element: <Lazy component={<PackageList />} /> },
    {
      path: Paths.packageDetails,
      element: <Lazy component={<PackageDetails />} />,
    },
    { path: Paths.sboms, element: <Lazy component={<SBOMList />} /> },
    {
      path: Paths.sbomDetails,
      element: <Lazy component={<SBOMDetails />} />,
    },
    {
      path: Paths.importers,
      element: <Lazy component={<ImporterList />} />,
    },
    { path: Paths.search, element: <Lazy component={<Search />} /> },
    { path: Paths.upload, element: <Lazy component={<Upload />} /> },
  ]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} key={location.pathname}>
      {allRoutes}
    </ErrorBoundary>
  );
};

export const useRouteParams = (pathParam: PathParam) => {
  const params = useParams();
  const value = params[pathParam];
  if (value === undefined) {
    throw new Error(
      `ASSERTION FAILURE: required path parameter not set: ${pathParam}`,
    );
  }
  return value;
};
