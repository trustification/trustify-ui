import React, { useReducer, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Brand,
  Button,
  ButtonVariant,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  MenuToggleElement,
  PageToggleButton,
  Split,
  SplitItem,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";

import { MoonIcon, SunIcon } from "@patternfly/react-icons/";
import EllipsisVIcon from "@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import BarsIcon from "@patternfly/react-icons/dist/js/icons/bars-icon";

import { isAuthRequired } from "@app/Constants";
import useBranding from "@app/hooks/useBranding";

import imgAvatar from "../images/avatar.svg";
import { AboutApp } from "./about";

export const HeaderApp: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("isDarkTheme") === "true" ? true : false
  );

  React.useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("pf-v6-theme-dark");
      localStorage.setItem("isDarkTheme", "true");
    } else {
      document.documentElement.classList.remove("pf-v6-theme-dark");
      localStorage.setItem("isDarkTheme", "false");
    }
  }, [isDarkTheme]);

  const {
    masthead: { leftBrand, leftTitle, rightBrand },
  } = useBranding();

  const auth = (isAuthRequired && useAuth()) || undefined;

  const navigate = useNavigate();

  const [isAboutOpen, toggleIsAboutOpen] = useReducer((state) => !state, false);
  const [isKebabDropdownOpen, setIsKebabDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const onKebabDropdownToggle = () => {
    setIsKebabDropdownOpen(!isKebabDropdownOpen);
  };

  const onKebabDropdownSelect = () => {
    setIsKebabDropdownOpen(!isKebabDropdownOpen);
  };

  const logout = () => {
    auth &&
      auth
        .signoutRedirect()
        .then(() => {})
        .catch((err) => {
          console.error("Logout failed:", err);
          navigate("/");
        });
  };

  return (
    <>
      <AboutApp isOpen={isAboutOpen} onClose={toggleIsAboutOpen} />

      <Masthead>
        <MastheadMain>
          <MastheadToggle>
            <PageToggleButton variant="plain" aria-label="Global navigation">
              <BarsIcon />
            </PageToggleButton>
          </MastheadToggle>
          <MastheadBrand data-codemods>
            <MastheadLogo data-codemods>
              <Split>
                <SplitItem>
                  {leftBrand ? (
                    <Brand
                      src={leftBrand.src}
                      alt={leftBrand.alt}
                      heights={{ default: leftBrand.height }}
                    />
                  ) : null}
                </SplitItem>
                <SplitItem isFilled>
                  {leftTitle ? (
                    <Title
                      className="logo-pointer"
                      headingLevel={leftTitle?.heading ?? "h1"}
                      size={leftTitle?.size ?? "2xl"}
                    >
                      {leftTitle.text}
                    </Title>
                  ) : null}
                </SplitItem>
              </Split>
            </MastheadLogo>
          </MastheadBrand>
        </MastheadMain>
        <MastheadContent>
          <Toolbar id="toolbar" isFullHeight isStatic>
            <ToolbarContent>
              {/* toolbar items to always show */}
              <ToolbarGroup
                id="header-toolbar-tasks"
                variant="action-group-plain"
                align={{ default: "alignEnd" }}
              >
                <ToolbarItem>
                  <ToggleGroup aria-label="Default with single selectable">
                    <ToggleGroupItem
                      aria-label="light theme"
                      icon={<SunIcon />}
                      isSelected={!isDarkTheme}
                      onChange={() => setIsDarkTheme(false)}
                    />
                    <ToggleGroupItem
                      aria-label="dark theme"
                      icon={<MoonIcon />}
                      isSelected={isDarkTheme}
                      onChange={() => setIsDarkTheme(true)}
                    />
                  </ToggleGroup>
                </ToolbarItem>
              </ToolbarGroup>

              {/* toolbar items to show at desktop sizes */}
              <ToolbarGroup
                id="header-toolbar-desktop"
                variant="action-group-plain"
                gap={{ default: "gapNone", md: "gapMd" }}
                visibility={{
                  default: "hidden",
                  "2xl": "visible",
                  xl: "visible",
                  lg: "visible",
                  md: "hidden",
                }}
              >
                <ToolbarItem>
                  <Button
                    icon={<HelpIcon />}
                    id="about-button"
                    aria-label="about button"
                    variant={ButtonVariant.plain}
                    onClick={toggleIsAboutOpen}
                  />
                </ToolbarItem>
              </ToolbarGroup>

              {/* toolbar items to show at mobile sizes */}
              <ToolbarGroup
                id="header-toolbar-mobile"
                variant="action-group-plain"
                gap={{ default: "gapNone", md: "gapMd" }}
                visibility={{ lg: "hidden" }}
              >
                <ToolbarItem>
                  <Dropdown
                    isOpen={isKebabDropdownOpen}
                    onSelect={onKebabDropdownSelect}
                    onOpenChange={(isOpen: boolean) =>
                      setIsKebabDropdownOpen(isOpen)
                    }
                    popperProps={{ position: "right" }}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={onKebabDropdownToggle}
                        isExpanded={isKebabDropdownOpen}
                        variant="plain"
                        aria-label="About"
                      >
                        <EllipsisVIcon aria-hidden="true" />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      {auth && (
                        <DropdownItem key="logout" onClick={logout}>
                          Logout
                        </DropdownItem>
                      )}
                      <Divider key="separator" component="li" />
                      <DropdownItem key="about" onClick={toggleIsAboutOpen}>
                        <HelpIcon /> About
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
              </ToolbarGroup>

              {/* Show the SSO menu at desktop sizes */}
              <ToolbarGroup
                id="header-toolbar-sso"
                visibility={{
                  default: "hidden",
                  md: "visible",
                }}
              >
                {auth && (
                  <ToolbarItem
                    visibility={{ default: "hidden", md: "visible" }}
                  >
                    <Dropdown
                      isOpen={isUserDropdownOpen}
                      onSelect={() => setIsUserDropdownOpen(false)}
                      onOpenChange={(isOpen: boolean) =>
                        setIsUserDropdownOpen(isOpen)
                      }
                      popperProps={{ position: "right" }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() =>
                            setIsUserDropdownOpen(!isUserDropdownOpen)
                          }
                          isFullHeight
                          isExpanded={isUserDropdownOpen}
                          icon={<Avatar src={imgAvatar} alt="" size="sm" />}
                        >
                          {auth.user?.profile.preferred_username ||
                            auth.user?.profile.sub}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem key="logout" onClick={logout}>
                          Logout
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                )}
              </ToolbarGroup>

              {rightBrand ? (
                <ToolbarGroup>
                  <ToolbarItem>
                    <Brand
                      src={rightBrand.src}
                      alt={rightBrand.alt}
                      heights={{ default: rightBrand.height }}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
              ) : null}
            </ToolbarContent>
          </Toolbar>
        </MastheadContent>
      </Masthead>
    </>
  );
};
