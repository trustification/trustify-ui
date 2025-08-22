Feature: SBOM Explorer - View SBOM details

  Scenario Outline: View <sbomType> SBOM Overview
    Given There is ingested <sbomType> SBOM
    When User visits SBOM details Page
    # e.g. by selecting SBOM from Search results or from Latest SBOMS on Dashboard
    Then SBOM name should be visible in top section
    And link to Download SBOM should be visible
    # `top section` refers to "upper" part visible above tabs selection
    And Info tab selector should be visible
    And Packages tab selector should be visible
    And Vulnerabilities tab selector should be visible
    And Dependency Analytics Report tab should not be visible
    # D.A.R tab not present at all, this test can be removed for future versions

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: <sbomType> SBOM name visible while on Packages tab
    Given There is ingested <sbomType> SBOM with packages
    When User visits SBOM details Page
    And User selects Packages tab
    Then SBOM name should be visible in top section

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: <sbomType> SBOM name visible while on Vulnerabilities tab
    Given There is ingested <sbomType> SBOM with packages
    When User visits SBOM details Page
    And User selects Vulnerabilities tab
    Then SBOM name should be visible in top section

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: View <sbomType> SBOM Info (Metadata)
    Given There is ingested <sbomType> SBOM
    When User visits SBOM details Page
    Then Info tab is selected by default
    And SBOM name should be visible inside the tab
    And SBOM namespace should be visible inside the tab
    And SBOM Version should be visibile inside the tab
    And SBOM License should be visible inside the tab
    And SBOM Creation date should be visible inside the tab
    And SBOM Creator should be visible inside the tab
    And SBOM size and Total number of packages should be visible inside the tab
    And Package overview panel should be visible inside the tab
    # TODO: this Package panel needs clarification
    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Downloading <sbomType> SBOM file
    Given There is ingested <sbomType> SBOM
    When User visits SBOM details Page
    And User clicks on Download SBOM link
    Then SBOM file should be downloaded
    And downloaded file should match original <sbomType> SBOM json file
    # TODO: clarify if it should be exact match/copy (including formatting)
    #       or just in meaning (json keys/values)
    #       or if it may even be just processed subset of information

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: View list of <sbomType> SBOM Packages
    Given There is ingested <sbomType> SBOM with packages
    When User visits SBOM details Page
    And User selects Packages tab
    Then list of SBOM Packages should be sorted alphabetically by Name in ascending order

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Package tab column headers of <sbomType> SBOM
    Given There is ingested <sbomType> SBOM with packages
    When User visits SBOM details Page
    And User selects Packages tab
    Then list of packages should have columns Name, Version and Qualifiers

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Filter matching list of <sbomType> SBOM Packages
    Given There is ingested <sbomType> SBOM with packages
    When User visits SBOM details Page
    And User selects Packages tab
    # TODO clarify - search using Filter field is CASE SENSITIVE in v1.2.2 - should it be expected in v2?
    And Filter input is set to part of SBOM Package name shared by multiple packages
    Then list of SBOM Packages should show only the matching ones
    And list of SBOM Packages should be sorted alphabetically by Package name in ascending order

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Filter not matching list of <sbomType> SBOM Packages
    Given There is ingested <sbomType> SBOM with packages
    When User visits SBOM details Page
    And User selects Packages tab
    And Filter input is set to value not matching any SBOM Package name
    Then list of SBOM Packages should be empty # showing info about no-match-found?

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Clear filtering of list of <sbomType> SBOM Packages
    Given There is ingested <sbomType> SBOM with packages
    When User visits SBOM details Page
    And User selects Packages tab
    And Filter input is set to value not matching any SBOM Package name
    And Filter input is cleared
    Then list of SBOM Packages should show list of SBOM Packages

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: View paginated list of <sbomType> SBOM Packages
    Given There is ingested <sbomType> SBOM with more packages than fits in a page
    When User visits SBOM details Page
    And User selects Packages tab
    Then Pagination of list of packages works

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: View expanded <sbomType> SBOM Package with sufficient data
    # TODO: clarify 'sufficient data' (in all parts of this scenario)
    Given There is ingested <sbomType> SBOM with Packages with sufficient data
    When visiting SBOM details page
    And selecting Packages tab
    And expanding Package entry of package with sufficient data
    Then columns Packages, Details, Qualifiers and Version should be visible in SBOM Package details
    And each Package name in SBOM Package details should be link to Package Explorer

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Link to Package Explorer from <sbomType> SBOM Package with sufficient data
    # TODO: clarify 'sufficient data' (in all parts of this scenario)
    Given There is ingested <sbomType> SBOM with Packages with sufficient data
    When visiting SBOM details page
    And selecting Packages tab
    And expanding Package entry of package with sufficient data
    And clicking on first Package name link
    Then Application navigates to Package Explorer page for the selected Package

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: View <sbomType> SBOM Vulnerabilities
    Given An ingested <sbomType> SBOM containing Vulnerabilities
    When User visits SBOM details page
    And Selects Vulnerabilities tab
    Then Vulnerability Risk Profile circle should be visible
    And Vulnerability Risk Profile shows summary of vulnerabilities
    And SBOM Name should be visible inside the tab
    And SBOM Version should be visible inside the tab
    And SBOM Creation date should be visible inside the tab
    And List of related Vulnerabilities should be sorted by CVSS in descending order

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Pagination of <sbomType> SBOM Vulnerabilities
    Given there is ingested <sbomType> SBOM which is affected by Vulnerabilities
    When user visits SBOM details page
    And user selects Vulnerabilities tab
    Then Pagination of Vulnerabilities list works

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Columns in list of <sbomType> SBOM Vulnerabilities
    Given there is ingested <sbomType> SBOM which is affected by Vulnerabilities
    When user visits SBOM details page
    And user selects Vulnerabilities tab
    Then list of Vulnerabilities has column ID
    And list of Vulnerabilities has column Description
    And list of Vulnerabilities has column CVSS
    And list of Vulnerabilities has column Affected dependencies
    And list of Vulnerabilities has column Published
    And list of Vulnerabilities has column Updated

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Sorting of <sbomType> SBOM Vulnerabilities
    Given there is ingested <sbomType> SBOM which is affected by Vulnerabilities
    When user visits SBOM details page
    And user selects Vulnerabilities tab
    Then list of Vulnerabilities can be sorted by all columns except description

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Expand description of <sbomType> SBOM Vulnerability
    Given there is ingested <sbomType> SBOM which is affected by Vulnerability with long description
    When user visits SBOM details page
    And user selects Vulnerabilities tab
    And clicks 'Show more' link
    Then full Vulnerability description should be visible

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: Collapse description of <sbomType> SBOM Vulnerability
    Given there is ingested <sbomType> SBOM which is affected by Vulnerability with long description
    When user visits SBOM details page
    And user selects Vulnerabilities tab
    And clicks 'Show more' link
    And clicks 'Show less' link
    Then shortened Vulnerability description should be visible

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: View <sbomType> SBOM Vulnerability with relevant advisory
    Given there is ingested <sbomType> SBOM which is affected by Vulnerability with relevant Advisory
    When user visits SBOM details page
    And user selects Vulnerabilities tab
    And user finds Vulnerability with relevant Advisory
    And user clicks on CVE ID of the Vulnerability with relevant advisory
    Then link to All CVE details should be visible
    And list of relevant Advisories should be visible
    And each relevant Advisory should have link to details of the Advisory

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  Scenario Outline: View <sbomType> SBOM Vulnerability without relevant advisory
    Given there is ingested <sbomType> SBOM which is affected by Vulnerability without relevant Advisory
    When user visits SBOM details page
    And user selects Vulnerabilities tab
    And user finds Vulnerability with relevant Advisory
    And user clicks CVE ID of the Vulnerability without relevant Advisory
    Then link to All CVE details should be visible
    And list of relevant Advisories should not be visible

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |

  # TODO: clarify if this is also expected in V2
  # also - if CVE is listed under SBOM Vulns. does it imply that to always have at least one affected dependency/package?
  #
  # Scenario Outline: View <sbomType> SBOM Vulnerability with affected dependency
  #   Given there is ingested <sbomType> SBOM which is affected by Vulnerability with affected dependency
  #
  #   When user visits SBOM details page
  #   And user selects Vulnerabilities tab
  #   And user finds Vulnerability with affected dependency
  #   And user selects to see given Vulnerability Affected dependencis (by clicking on the count of Affected dependencies)
  #   Then list of affected packages should be visible
  #   And each entry should have expected fields (Type, Namespace, Name, Version, Path, Qualifiers)
  #   And each entry name should be link to that Package details page
  #   # And each entry should be expandable - to what - currently it says just 'Only direct dependencies'?
  #
  #   Examples:
  #     | sbomType |
  #     | CycloneDX |
  #     | SPDX |

  # TODO: clarify if this belongs here, seems to me that it should be SBOM uploading feature?
  Scenario Outline: View <sbomType> SBOM Overview for unsafe SBOM filename
    Given there is ingested <sbomType> SBOM with name not compatible with S3 storage
    # ref for valid naming https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
    # e.g. '@', '!' or ':' in file name
    When user visits SBOM Details page
    Then SBOM name should be visible
    And link to Download SBOM should be visible
    # or possibly this should be just combination of input data and Scenario Outline
    # (as Overview and Metadata and likely some other scenarios apply here too)
    # e.g. the Examples in `SBOM Overview` or `SBOM Info` scenarios could 'just' include extra types:
    # | CycloneDX-s3-unsafe |
    # | SPDX-s3-unsafe |

    Examples:
      | sbomType |
      | CycloneDX |
      | SPDX |
