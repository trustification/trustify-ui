import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import {
  Nav,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  SkipToContent,
} from "@patternfly/react-core";

import { NotificationsProvider } from "@app/components/NotificationsContext";

import { HeaderApp } from "@app/layout/header";
import { PageContentWithDrawerProvider } from "@app/components/PageDrawerContext";
import { Notifications } from "@app/components/Notifications";

import { SearchPage } from "./pages/search";
import { ProductsPage } from "./pages/products";

type Route = "dashboard" | "search" | "products";
type RouteProps = {
  [key in Route]: {
    element: React.ReactNode;
  };
};

type AppProps = {
  route: Route;
};

const App: React.FC<AppProps> = ({ route }) => {
  const routeList: RouteProps = {
    dashboard: {
      element: <>Dashboard</>,
    },
    search: {
      element: <SearchPage />,
    },
    products: {
      element: <ProductsPage />,
    },
  };

  return routeList[route].element;
};

const SidebarApp: React.FC = () => {
  return (
    <PageSidebar>
      <Nav id="nav-sidebar" aria-label="Nav">
        <NavList>
          <NavItem>Dashboard</NavItem>
          <NavItem>Search</NavItem>
          <NavItem>Products</NavItem>
          <NavItem>Vulnerabilities</NavItem>
          <NavItem>Packages</NavItem>
          <NavItem>Data sources</NavItem>
        </NavList>
      </Nav>
    </PageSidebar>
  );
};

interface DefaultLayoutProps {
  children?: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const pageId = "main-content-page-layout-horizontal-nav";
  const PageSkipToContent = (
    <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>
  );

  return (
    <Page
      header={<HeaderApp />}
      sidebar={<SidebarApp />}
      isManagedSidebar
      skipToContent={PageSkipToContent}
      mainContainerId={pageId}
    >
      <PageContentWithDrawerProvider>
        {children}
        <Notifications />
      </PageContentWithDrawerProvider>
    </Page>
  );
};

const meta = {
  title: "v2.1/App",
  component: App,
  decorators: [
    (Story) => (
      <NotificationsProvider>
        <DefaultLayout>
          <Story />
        </DefaultLayout>
      </NotificationsProvider>
    ),
  ],
} satisfies Meta<typeof SearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  args: {
    route: "dashboard",
  },
};

export const Search: Story = {
  args: {
    route: "search",
  },
};

export const Products: Story = {
  args: {
    route: "products",
  },
};
