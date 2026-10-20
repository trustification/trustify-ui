import { lazy } from "react";
import { createBrowserRouter, useParams, type Params } from "react-router-dom";

import { queryClient } from "./queries/config";
import { sbomByIdQueryOptions } from "./queries/sboms";
import { packageByIdQueryOptions } from "./queries/packages";
import { advisoryByIdQueryOptions } from "./queries/advisories";
import { SBOMGroupByIdQueryOptions } from "./queries/sbom-groups";
import { vulnerabilityByIdQueryOptions } from "./queries/vulnerabilities";

import { LazyRouteElement } from "@app/components/LazyRouteElement";
import App from "./App";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";

/* eslint-disable react-refresh/only-export-components */
const Home = lazy(() => import("./pages/home"));

// Advisory
const AdvisoryList = lazy(() => import("./pages/advisory-list"));
const AdvisoryUpload = lazy(() => import("./pages/advisory-upload"));
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
const SBOMUpload = lazy(() => import("./pages/sbom-upload"));
const SBOMScan = lazy(() => import("./pages/sbom-scan"));
const SBOMDetails = lazy(() => import("./pages/sbom-details"));
const RemediationReport = lazy(() => import("./pages/remediation-report"));

// SBOM Groups
const SbomGroupList = lazy(() => import("./pages/sbom-groups"));
const SBOMGroupDetails = lazy(() => import("./pages/sbom-group-details"));

// Others
const Search = lazy(() => import("./pages/search"));
const ImporterList = lazy(() => import("./pages/importer-list"));
const LicenseList = lazy(() => import("./pages/license-list"));
const CryptoList = lazy(() => import("./pages/crypto-list"));
const ModelList = lazy(() => import("./pages/model-list"));
const NotFound = lazy(() => import("./pages/not-found"));
/* eslint-enable react-refresh/only-export-components */

export enum PathParam {
  ADVISORY_ID = "advisoryId",
  VULNERABILITY_ID = "vulnerabilityId",
  SBOM_ID = "sbomId",
  PACKAGE_ID = "packageId",
  LICENSE_NAME = "licenseName",
  SBOM_GROUP_ID = "sbomGroupId",
}

export const Paths = {
  advisories: "/advisories",
  advisoryUpload: "/advisories/upload",
  advisoryDetails: `/advisories/:${PathParam.ADVISORY_ID}`,
  vulnerabilities: "/vulnerabilities",
  vulnerabilityDetails: `/vulnerabilities/:${PathParam.VULNERABILITY_ID}`,
  sboms: "/sboms",
  sbomUpload: "/sboms/upload",
  sbomScan: "/sboms/scan",
  remediationReport: "/sboms/remediation-report",
  sbomDetails: `/sboms/:${PathParam.SBOM_ID}`,
  packages: "/packages",
  packageDetails: `/packages/:${PathParam.PACKAGE_ID}`,
  search: "/search",
  importers: "/importers",
  licenses: "/licenses",
  cryptography: "/cryptography",
  models: "/models",
  sbomGroups: "/sbom-groups",
  sbomGroupDetails: `/sbom-groups/:${PathParam.SBOM_GROUP_ID}`,
} as const;

export const getPathFromParams = (
  params: Params<string>,
  pathParam: PathParam,
) => {
  const value = params[pathParam];
  if (value === undefined) {
    throw new Error(
      `ASSERTION FAILURE: required path parameter not set: ${pathParam}`,
    );
  }
  return value;
};

export const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LazyRouteElement identifier="home" component={<Home />} />,
      },
      {
        path: Paths.advisories,
        element: (
          <LazyRouteElement
            identifier="advisory-list"
            component={<AdvisoryList />}
          />
        ),
      },
      {
        path: Paths.advisoryDetails,
        element: (
          <LazyRouteElement
            identifier="advisory-details"
            component={<AdvisoryDetails />}
          />
        ),
        errorElement: <RouteErrorBoundary />,
        loader: async ({ params }) => {
          const advisoryId = getPathFromParams(params, PathParam.ADVISORY_ID);
          const response = await queryClient.ensureQueryData(
            advisoryByIdQueryOptions(advisoryId),
          );
          return {
            advisory: response.data,
          };
        },
      },
      {
        path: Paths.advisoryUpload,
        element: (
          <LazyRouteElement
            identifier="advisory-upload"
            component={<AdvisoryUpload />}
          />
        ),
      },
      {
        path: Paths.importers,
        element: (
          <LazyRouteElement
            identifier="importer-list"
            component={<ImporterList />}
          />
        ),
      },
      {
        path: Paths.licenses,
        element: (
          <LazyRouteElement
            identifier="license-list"
            component={<LicenseList />}
          />
        ),
      },
      {
        path: Paths.cryptography,
        element: (
          <LazyRouteElement
            identifier="crypto-list"
            component={<CryptoList />}
          />
        ),
      },
      {
        path: Paths.models,
        element: (
          <LazyRouteElement identifier="model-list" component={<ModelList />} />
        ),
      },
      {
        path: Paths.packages,
        element: (
          <LazyRouteElement
            identifier="package-list"
            component={<PackageList />}
          />
        ),
      },
      {
        path: Paths.packageDetails,
        element: (
          <LazyRouteElement
            identifier="package-details"
            component={<PackageDetails />}
          />
        ),
        errorElement: <RouteErrorBoundary />,
        loader: async ({ params }) => {
          const packageId = getPathFromParams(params, PathParam.PACKAGE_ID);
          const response = await queryClient.ensureQueryData(
            packageByIdQueryOptions(packageId),
          );
          return {
            package: response.data,
          };
        },
      },
      {
        path: Paths.sboms,
        element: (
          <LazyRouteElement identifier="sbom-list" component={<SBOMList />} />
        ),
      },
      {
        path: Paths.remediationReport,
        element: (
          <LazyRouteElement
            identifier="remediation-report"
            component={<RemediationReport />}
          />
        ),
      },
      {
        path: Paths.sbomDetails,
        element: (
          <LazyRouteElement
            identifier="sbom-details"
            component={<SBOMDetails />}
          />
        ),
        errorElement: <RouteErrorBoundary />,
        loader: async ({ params }) => {
          const sbomId = getPathFromParams(params, PathParam.SBOM_ID);
          const response = await queryClient.ensureQueryData(
            sbomByIdQueryOptions(sbomId),
          );
          return {
            sbom: response?.data,
          };
        },
      },
      {
        path: Paths.sbomScan,
        element: (
          <LazyRouteElement identifier="sbom-scan" component={<SBOMScan />} />
        ),
      },
      {
        path: Paths.sbomUpload,
        element: (
          <LazyRouteElement
            identifier="sbom-upload"
            component={<SBOMUpload />}
          />
        ),
      },
      {
        path: Paths.search,
        element: (
          <LazyRouteElement identifier="search" component={<Search />} />
        ),
      },
      {
        path: Paths.vulnerabilities,
        element: (
          <LazyRouteElement
            identifier="vulnerability-list"
            component={<VulnerabilityList />}
          />
        ),
      },
      {
        path: Paths.vulnerabilityDetails,
        element: (
          <LazyRouteElement
            identifier="vulnerability-details"
            component={<VulnerabilityDetails />}
          />
        ),
        errorElement: <RouteErrorBoundary />,
        loader: async ({ params }) => {
          const vulnerabilityId = getPathFromParams(
            params,
            PathParam.VULNERABILITY_ID,
          );
          const response = await queryClient.ensureQueryData(
            vulnerabilityByIdQueryOptions(vulnerabilityId, { scores: true }),
          );
          return {
            vulnerability: response.data,
          };
        },
      },
      {
        path: Paths.sbomGroups,
        element: (
          <LazyRouteElement
            identifier="sbom-group-list"
            component={<SbomGroupList />}
          />
        ),
      },
      {
        path: Paths.sbomGroupDetails,
        element: (
          <LazyRouteElement
            identifier="sbom-group-details"
            component={<SBOMGroupDetails />}
          />
        ),
        errorElement: <RouteErrorBoundary />,
        loader: async ({ params }) => {
          const sbomGroupId = getPathFromParams(
            params,
            PathParam.SBOM_GROUP_ID,
          );
          const response = await queryClient.ensureQueryData(
            SBOMGroupByIdQueryOptions(sbomGroupId),
          );
          return {
            sbomGroup: response?.data,
          };
        },
      },
      {
        path: "*",
        element: (
          <LazyRouteElement identifier="not-found" component={<NotFound />} />
        ),
      },
    ],
  },
]);

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
