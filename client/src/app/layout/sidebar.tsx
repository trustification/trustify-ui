import type React from "react";
import { NavLink } from "react-router-dom";

import {
  Icon,
  Nav,
  NavItem,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from "@patternfly/react-core";
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/esm/icons/external-link-alt-icon";
import { css } from "@patternfly/react-styles";
import nav from "@patternfly/react-styles/css/components/Nav/nav";

import { Paths } from "@app/Routes";

const LINK_CLASS = nav.navLink;
const ACTIVE_LINK_CLASS = nav.modifiers.current;

export const SidebarApp: React.FC = () => {
  const renderPageNav = () => {
    return (
      <Nav id="nav-sidebar" aria-label="Nav">
        <NavList>
          <li className={nav.navItem}>
            <NavLink
              to="/"
              className={({ isActive }) => {
                return css(LINK_CLASS, isActive ? ACTIVE_LINK_CLASS : "");
              }}
            >
              Dashboard
            </NavLink>
          </li>
          <li className={nav.navItem}>
            <NavLink
              to={Paths.search}
              className={({ isActive }) => {
                return css(LINK_CLASS, isActive ? ACTIVE_LINK_CLASS : "");
              }}
            >
              Search
            </NavLink>
          </li>
          <li className={nav.navItem}>
            <NavLink
              to={Paths.sboms}
              className={({ isActive }) => {
                return css(LINK_CLASS, isActive ? ACTIVE_LINK_CLASS : "");
              }}
            >
              SBOMs
            </NavLink>
          </li>
          <li className={nav.navItem}>
            <NavLink
              to={Paths.vulnerabilities}
              className={({ isActive }) => {
                return css(LINK_CLASS, isActive ? ACTIVE_LINK_CLASS : "");
              }}
            >
              Vulnerabilities
            </NavLink>
          </li>
          <li className={nav.navItem}>
            <NavLink
              to={Paths.packages}
              className={({ isActive }) => {
                return css(LINK_CLASS, isActive ? ACTIVE_LINK_CLASS : "");
              }}
            >
              Packages
            </NavLink>
          </li>
          <li className={nav.navItem}>
            <NavLink
              to={Paths.advisories}
              className={({ isActive }) => {
                return css(LINK_CLASS, isActive ? ACTIVE_LINK_CLASS : "");
              }}
            >
              Advisories
            </NavLink>
          </li>
          <li className={nav.navItem}>
            <NavLink
              to={Paths.importers}
              className={({ isActive }) => {
                return css(LINK_CLASS, isActive ? ACTIVE_LINK_CLASS : "");
              }}
            >
              Importers
            </NavLink>
          </li>
          <NavItem
            to={`${window.location.origin}/openapi`}
            target="_blank"
            rel="noopener noreferrer"
          >
            API&nbsp;
            <Icon isInline>
              <ExternalLinkAltIcon />
            </Icon>
          </NavItem>
        </NavList>
      </Nav>
    );
  };

  return (
    <PageSidebar>
      <PageSidebarBody>{renderPageNav()}</PageSidebarBody>
    </PageSidebar>
  );
};
