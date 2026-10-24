import { type BrandingStrings, brandingStrings } from "@trustify-ui/common";

/**
 * Wrap the branding strings in a getter so components access it in a standard
 * way instead of a direct import.  This allows the branding implementation
 * to change in future with a minimal amount of refactoring in existing components.
 */
const getBranding = (): BrandingStrings => {
  return brandingStrings;
};

export default getBranding;
