import React from "react";
import { Link } from "react-router-dom";

import DetailsPage from "@patternfly/react-component-groups/dist/dynamic/DetailsPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
} from "@patternfly/react-core";

import { PathParam, useRouteParams } from "@app/Routes";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useFetchProductById } from "@app/queries/products";

import { ProductVersions } from "./product-versions";

export const ProductDetails: React.FC = () => {
  const productId = useRouteParams(PathParam.PRODUCT_ID);
  const { product, isFetching, fetchError } = useFetchProductById(productId);

  return (
    <>
      <PageSection variant="light">
        <DetailsPage
          breadcrumbs={
            <Breadcrumb>
              <BreadcrumbItem key="advisories">
                <Link to="/products">Products</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive>Product details</BreadcrumbItem>
            </Breadcrumb>
          }
          actionButtons={[]}
          pageHeading={{
            title: product?.name ?? "",
          }}
          tabs={[]}
        >
          <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
            {product && <ProductVersions product={product} />}
          </LoadingWrapper>
        </DetailsPage>
      </PageSection>
    </>
  );
};
