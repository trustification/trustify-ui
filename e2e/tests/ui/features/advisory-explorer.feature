Feature: Advisory Explorer
    As a Developer or a Devsecops Engineer
    I want to be able to display all available information about a single advisory - metadata and related vulnerabilites

Background:
    Given User is using an instance of the TPA Application
    And User has successfully uploaded an SBOM
    And User has successfully uploaded a vulnerability dataset
    And User has successfully uploaded an advisory dataset

# Advisory Explorer
Scenario: Navigating to the Advisory Explorer page by selecting it from the list of all advisories
    Given User is on the Home page
    When User clicks on the Search button in the menu
    And User selects the Advisories tab
    And User selects an advisory from the list
    Then The Advisory Explorer page should display

Scenario: Navigating to the Advisory Explorer page by searching for it in the search bar
    Given User is on the Home page
    When User clicks on the Search textbox
    And User enters the ID of an advisory
    And User searches for the advisory
    And User selects the advisory returned by the search
    Then The Advisory Explorer page should display

Scenario: Navigating to the Advisory Explorer page by filtering advisories in the list of all advisories
    Given User is on the Home page
    When User clicks on the Search button in the menu
    And User selects the Advisories tab
    And User selects a filter
    And User selects an advisory returned by the filter
    Then The Advisory Explorer page should display

Scenario: Display an overview of an advisory
    Given User is on the Home page
    When User navigates to a Advisory Explorer page
    Then The ID and description of the advisory should be visible
    And "Show more" button should be visible for advisories with a long title
    And Download button should be visible

Scenario: Download an advisory from the Advisory Explorer page
    Given User is on the Home page
    When User navigates to the Advisory Explorer page
    And User clicks the Download button
    Then The advisory should download as a JSON file

# Advisory Overview
Scenario: Display detailed information about a single advisory
    Given User is on the Home page
    When User navigates to the Advisory Explorer page
    Then The Overview, Publisher, Tracking, References and Product Info panels should display
    And The Product Info panel should display a list of impacted products
    And The Product Info panel items should be collapsable

# Advisory Notes
Scenario: Display notes about a single advisory
    Given User is on the Home page
    When User navigates to the Advisory Explorer page
    And User navigates to the Notes tab on the Advisory Overview page
    Then All notes on an advisory should display

# Advisory Vulnerabilities
Scenario: Display vulnerabilities tied to a single advisory
    Given User visits Advisory details Page of "<advisoryName>"
    Then User navigates to the Vulnerabilites tab on the Advisory Overview page
    Then A list of all active vulnerabilites tied to the advisory should display
    And The ID, Title, Discovery, Release, Score and CWE information should be visible for each vulnerability
    And The vulnerabilities should be sorted by ID by default
    And User visits Vulnerability details Page of "<vulnerabilityID>" by clicking it

    Examples:
        | advisoryName    | vulnerabilityID | 
        | GHSA-526j-mv3p-f4vv | CVE-2025-54379   | 


