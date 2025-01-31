import React from "react";

import { AboutModal, Content, ContentVariants } from "@patternfly/react-core";

import backgroundImage from "@app/images/pfbg-icon.svg";

import ENV from "@app/env";
import useBranding from "@app/hooks/useBranding";

interface IButtonAboutAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRANSPARENT_1x1_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw== ";

export const AboutApp: React.FC<IButtonAboutAppProps> = ({
  isOpen,
  onClose,
}) => {
  const { about } = useBranding();

  return (
    <AboutModal
      isOpen={isOpen}
      onClose={onClose}
      productName={about.displayName}
      brandImageAlt="Logo"
      brandImageSrc={about.imageSrc ?? TRANSPARENT_1x1_GIF}
      backgroundImageSrc={backgroundImage}
      trademark={`COPYRIGHT © 2020, ${new Date().getFullYear()}`}
    >
      <Content>
        <Content component={ContentVariants.p}>
          {about.displayName} is vendor-neutral, thought-leadering, mostly
          informational collection of resources devoted to making Software
          Supply Chains easier to create, manage, consume and ultimately… to
          trust!
        </Content>

        {about.documentationUrl ? (
          <Content component={ContentVariants.p}>
            For more information refer to{" "}
            <Content
              component={ContentVariants.a}
              href={about.documentationUrl}
              target="_blank"
            >
              {about.displayName} documentation
            </Content>
          </Content>
        ) : null}
      </Content>
      <Content className="pf-v6-u-py-xl">
        <Content>
          <Content component="dl">
            <Content component="dt">Version</Content>
            <Content component="dd">{ENV.VERSION}</Content>
          </Content>
        </Content>
      </Content>
    </AboutModal>
  );
};
