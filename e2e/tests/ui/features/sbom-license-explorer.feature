Feature: SBOM Explorer – View and Filter Package Licenses
    As a platform Eng 
    I want to be able to view the licenses in specific SBOM when viewing the SBOM details in the UI.

Background: Authentication
    Given User is authenticated

Scenario: View per-package licence details for "<packageName>" in <sbomType> SBOM "<sbomName>"
    Given An ingested "<sbomType>" SBOM "<sbomName>" is available
    When  User visits SBOM details Page of "<sbomName>"
    And   User selects the Tab "Packages"
    Then  The Package table contains the column "License"

    When  The "Name" column of the Package table contains "<packageName>"
    And   User expands the package row "<packageName>"
    Then  The expanded panel shows a section "Licenses"
    And   The expanded panel lists at least one entry with "License Name" and "License Type"

Scenario: Search packages by licence "<licenseName>" in <sbomType> SBOM "<sbomName>"
    Given An ingested "<sbomType>" SBOM "<sbomName>" is available
    When  User visits SBOM details Page of "<sbomName>"
    And   User selects the Tab "Packages"
    When  Search by FilterText "<licenseName>"
    Then  The Package table total results is greater than 0
    And   Every visible row in the Package table shows "<licenseName>" in the "License" column

    When  User clear all filters
    Then  The Package table total results is greater than 1
