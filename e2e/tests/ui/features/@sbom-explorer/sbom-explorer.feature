Feature: SBOM Explorer - View SBOM details
    Background: Authentication
        Given User is authenticated

    Scenario Outline: View SBOM Overview
        Given An ingested SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        Then The page title is "<sbomName>"
        And Tab "Info" is visible
        And Tab "Packages" is visible
        And Tab "Vulnerabilities" is visible
        But Tab "Dependency Analytics Report" is not visible

        Examples:
            | sbomName    |
            | quarkus-bom |

    Scenario Outline: View SBOM Info (Metadata)
        Given An ingested SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        Then Tab "Info" is selected
        Then "SBOM's name" is visible
        And "SBOM's namespace" is visible
        And "SBOM's license" is visible
        And "SBOM's creation date" is visible
        And "SBOM's creator" is visible

        Examples:
            | sbomName    |
            | quarkus-bom |
    
    Scenario Outline: Downloading SBOM file
        Given An ingested SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        Then "Download SBOM" action is invoked and downloaded filename is "<expectedSbomFilename>"
        Then "Download License Report" action is invoked and downloaded filename is "<expectedLicenseFilename>"

        Examples:
            | sbomName    | expectedSbomFilename | expectedLicenseFilename     |
            | quarkus-bom | quarkus-bom.json     | quarkus-bom_licenses.tar.gz |
    
    Scenario Outline: View list of SBOM Packages
        Given An ingested SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Packages"
        # confirms its visible for all tabs
        Then The page title is "<sbomName>"
        Then The Package table is sorted by "Name"

        When Search by FilterText "<packageName>"
        Then The Package table is sorted by "Name"
        Then The Package table total results is 1
        Then The "Name" column of the Package table table contains "<packageName>"

        When Search by FilterText "nothing matches"
        Then The Package table total results is 0

        When User clear all filters
        Then The Package table total results is greather than 1

        Examples:
            | sbomName    | packageName |
            | quarkus-bom | jdom        |

    Scenario Outline: View SBOM Vulnerabilities
        Given An ingested SBOM "<sbomName>" containing Vulnerabilities
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Vulnerabilities"
        When User Clicks on Vulnerabilities Tab Action
        Then Vulnerability Popup menu appears with message
        Then Vulnerability Risk Profile circle should be visible
        Then Vulnerability Risk Profile shows summary of vulnerabilities
        Then SBOM Name "<sbomName>" should be visible inside the tab
        Then SBOM Version should be visible inside the tab
        Then SBOM Creation date should be visible inside the tab
        Then List of related Vulnerabilities should be sorted by "Id" in ascending order

        Examples:
        | sbomName    |
        | quarkus-bom |

    @slow
    Scenario Outline: Pagination of SBOM Vulnerabilities table
        Given An ingested SBOM "<sbomName>" containing Vulnerabilities
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Vulnerabilities"
        Then Pagination of Vulnerabilities list works
        Examples:
        | sbomName    |
        | quarkus-bom |

    @slow
    Scenario Outline: View paginated list of SBOM Packages
        Given An ingested SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Packages"
        Then Pagination of Packages list works
        Examples:
        |        sbomName        |
        | ubi9-minimal-container |

    Scenario Outline: Check Column Headers of SBOM Explorer Vulnerabilities table
        Given An ingested SBOM "<sbomName>" containing Vulnerabilities
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Vulnerabilities"
        Then List of Vulnerabilities has column "Id"
        Then List of Vulnerabilities has column "Description"
        Then List of Vulnerabilities has column "CVSS"
        Then List of Vulnerabilities has column "Affected dependencies"
        Then List of Vulnerabilities has column "Published"
        Then List of Vulnerabilities has column "Updated"
        Examples:
        | sbomName    |
        | quarkus-bom |

    @slow
    Scenario Outline: Sorting SBOM Vulnerabilities
        Given An ingested SBOM "<sbomName>" containing Vulnerabilities
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Vulnerabilities"
        Then Table column "Description" is not sortable
        Then Sorting of "Id, Affected dependencies, Published, Updated" Columns Works
        #Then Sorting of "CVSS" Columns works
        # Bug: https://issues.redhat.com/browse/TC-2598
        Examples:
        | sbomName    |
        | quarkus-bom |

    Scenario Outline: Add Labels to SBOM from SBOM List Page
        Given An ingested SBOM "<sbomName>" is available
        When User Adds Labels "<Labels>" to "<sbomName>" SBOM from List Page
        Then The Label list "<Labels>" added to the SBOM "<sbomName>" on List Page
        Examples:
        | sbomName    |     Labels    |
        | quarkus-bom | RANDOM_LABELS |

    Scenario Outline: Add Labels to SBOM from SBOM Explorer Page
        Given An ingested SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        When User Adds Labels "<Labels>" to "<sbomName>" SBOM from Explorer Page
        Then The Label list "<Labels>" added to the SBOM "<sbomName>" on Explorer Page
        Examples:
        |         sbomName       |    Labels     |
        | ubi9-minimal-container | RANDOM_LABELS |