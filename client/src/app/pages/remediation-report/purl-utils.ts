/** Extract the package name from a PURL string (type+namespace+name+version). */
export const extractName = (purl: string): string => {
  return (
    purl
      .split("@")[0]
      ?.replace(/^pkg:[^/]+\//, "")
      ?.split("/")
      .pop() ?? purl
  );
};

/** Extract the version from a PURL string. */
export const extractVersion = (purl: string): string => {
  const afterAt = purl.split("@")[1] ?? "";
  return afterAt.split("?")[0] ?? "";
};
