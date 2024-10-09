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
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  MenuToggleElement,
  PageToggleButton,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";

import EllipsisVIcon from "@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import BarsIcon from "@patternfly/react-icons/dist/js/icons/bars-icon";

import { isAuthRequired } from "@app/Constants";
import useBranding from "@app/hooks/useBranding";

import imgAvatar from "../images/avatar.svg";
import { AboutApp } from "./about";

export const HeaderApp: React.FC = () => {
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
        <MastheadToggle>
          <PageToggleButton variant="plain" aria-label="Global navigation">
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadMain>
          <MastheadBrand>
            {leftBrand ? (
              <Brand
                src={leftBrand.src}
                alt={leftBrand.alt}
                heights={{ default: leftBrand.height }}
              />
            ) : null}
            {leftTitle ? (
              <Title
                className="logo-pointer"
                headingLevel={leftTitle?.heading ?? "h1"}
                size={leftTitle?.size ?? "2xl"}
              >
                {leftTitle.text}
              </Title>
            ) : null}
          </MastheadBrand>
        </MastheadMain>
        <MastheadContent>
          <Toolbar id="toolbar" isFullHeight isStatic>
            <ToolbarContent>
              {/* toolbar items to always show */}
              <ToolbarGroup
                id="header-toolbar-tasks"
                variant="icon-button-group"
                align={{ default: "alignRight" }}
              ></ToolbarGroup>

              {/* toolbar items to show at desktop sizes */}
              <ToolbarGroup
                id="header-toolbar-desktop"
                variant="icon-button-group"
                spacer={{ default: "spacerNone", md: "spacerMd" }}
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
                    id="about-button"
                    aria-label="about button"
                    variant={ButtonVariant.plain}
                    onClick={toggleIsAboutOpen}
                  >
                    <HelpIcon />
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>

              {/* toolbar items to show at mobile sizes */}
              <ToolbarGroup
                id="header-toolbar-mobile"
                variant="icon-button-group"
                spacer={{ default: "spacerNone", md: "spacerMd" }}
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
                          icon={<Avatar src={imgAvatar} alt="" />}
                        >
                          {auth.user?.profile.preferred_username}
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
