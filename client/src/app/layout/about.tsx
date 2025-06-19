import type React from "react";

import { AboutModal, Content, ContentVariants } from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

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
      trademark={`COPYRIGHT © 2020, ${new Date().getFullYear()}`}
    >
      <Content>
        <Content component={ContentVariants.p}>
          {about.displayName} is a proactive service that assists in risk
          management of Open Source Software (OSS) packages and dependencies.{" "}
          {about.displayName} brings awareness to and remediation of OSS
          vulnerabilities discovered within the software supply chain.
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
      <Content className={spacing.pyXl}>
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
