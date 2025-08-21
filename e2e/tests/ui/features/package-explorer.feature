Feature: Package Explorer - View details about Package
  User can navigate to and view details of what TPA knows about individual Package

  Background:
    Given There is SBOM with Package details ingested

  Scenario: View Package metadata
    When User visits Package details page
    # like from SBOM details page - Packages tab
    Then Package name should be visible in metadata section
    And Package version should be visible in metadata section
    And Package type should be visible in metadata section
    # metadata section refers to 'heading' part of the page above the Vuln./Products Tabs

  Scenario: View Vulnerabilities affecting the Package
    Given ingested SBOM Package is affected by CVE
    When User visits Package details page
    Then list of related vulnerabilities should show the CVE affecting given Package
    # for each CVE listed
    And CVE ID should be visible
    And CVE ID should be hyperlink leading to CVE Explorer page
    And CVE Description should be visible
    And CVE CVSS should be visible
    And CVE Date published should be visible

    Then list of related CVEs should be paginated
    # Pagination sounds like it should be its own reusable Feature/Scenario
    # and it will need to have Given precondition for too-many-entries-not-fitting-single-page
    # in addition to case when it fits single page (or is empty)

  Scenario: View Vulnerabilities affecting the Package with long CVE description
    Given ingested SBOM Package is affected by CVE with long description
    When User visits Package details page
    Then list of related vulnerabilities should show the CVE affecting given Package
    And Part of CVE Description should be visible
    And Show More hyperlink should be visible in CVE Description
    And Clicking the Show More link should expand the description
    And Full CVE description should be visible after expanding

  Scenario: View Products using the Package
    # Given Package is part of Product/SBOM (or is this implicit/always satisfied as the package info arrived from SBOM==Product?)
    When User visits Package details page
    And User selects tab showing Products using package
    Then list of products utilizing this Package should be visible
    # for each product entry
    And Product name should be visible
    And Product name should be hyperlink leading to SBOM Explorer page
    And Product version should be visible
    And Product supplier should be visible
    And Product dependency type should be visible
    And Product dependency type should have value of either 'Direct' or 'Transitive'

    Then list of related Products should be paginated
    # as in Vulnerabilities tab - likely multiple separate Scenarios

  Scenario: View long list of Products using the Package
    Given Package is part of multiple Products
    When User visits Package details page
    And User selects tab showing Products using package
    Then list of products utilizing this Package should be visible
    And list should be sorted alphabetically by Product name
