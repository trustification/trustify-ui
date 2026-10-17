Feature: License Explorer
	As a Platform Eng
	I want to be able to download the licenses in a CSV file format from a specific SBOM

Background:

Scenario: Verify Download Licences option on SBOM Search Results page for CycloneDX SBOM
	Given User Searches for CycloneDX SBOM "<sbomName>" using Search Text box
	When User Selects CycloneDX SBOM "<sbomName>" from the Search Results
	And User Clicks on SBOM name hyperlink from the Search Results
	And User Clicks "Action" button
	Then "Download License Report" Option should be visible

   Examples:
            | sbomName |
            | liboqs |

Scenario Outline: User Downloads license information for CycloneDX SBOM from SBOM Search Results page
	Given User Searches for CycloneDX SBOM "<sbomName>" using Search Text box
	When User Selects CycloneDX SBOM "<sbomName>" from the Search Results
	And User Clicks on SBOM name hyperlink from the Search Results
	And User Clicks "Action" button
	And Selects "Download License Report" option
	Then Licenses associated with the SBOM should be downloaded in TAR.GZ format using the SBOM name

   Examples:
            | sbomName |
            | liboqs |

Scenario: Verify Download Licences option on SBOM Explorer page for CycloneDX SBOM
	Given User Searches for CycloneDX SBOM "<sbomName>" using Search Text box and Navigates to Search results page
	When User Selects CycloneDX SBOM "<sbomName>" from the Search Results
	And User Clicks on SBOM name hyperlink from the Search Results
	Then Application Navigates to SBOM Explorer page
	And User Clicks "Action" button
	And "Download License Report" Option should be visible

  Examples:
            | sbomName |
            | liboqs |

Scenario: User Downloads license information for CycloneDX SBOM from SBOM Explorer page
	Given User is on SBOM Explorer page for the CycloneDX SBOM "<sbomName>"
	And User Clicks on "Download License Report" button
	Then Licenses associated with the SBOM should be downloaded in TAR.GZ format using the SBOM name

  Examples:
            | sbomName |
            | liboqs |

Scenario: Verify the files on downloaded CycloneDX SBOM license TAR.GZ
	Given User has Downloaded the License information for CycloneDX SBOM "<sbomName>"
	When User extracts the Downloaded license TAR.GZ file
	Then Extracted files should contain two CSVs, one for Package license information and another one for License reference

  Examples:
            | sbomName |
            | liboqs |

Scenario: Verify the headers on CycloneDX SBOM package License CSV file
	Given User extracted the CycloneDX SBOM "<sbomName>" license compressed file
	When User Opens the package license information file
	Then The file should have the following headers - SBOM name, SBOM id, package name, package group, package version, package purl, package cpe and license

  Examples:
            | sbomName |
            | liboqs |

Scenario: Verify the headers on CycloneDX SBOM License reference CSV file
	Given User extracted the CycloneDX SBOM "<sbomName>" license compressed file
	When User Opens the license reference file
	Then The file should have the following headers - licenseId, name, extracted text and comment

  Examples:
            | sbomName |
            | liboqs |

Scenario: Verify the contents on CycloneDX SBOM license reference CSV file
	Given User is on license reference "<sbomName>" file
	Then The License reference CSV should be empty

  Examples:
            | sbomName |
            | liboqs   |
