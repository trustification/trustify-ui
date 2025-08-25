Feature: Advisory Explorer
    Background: Authentication
        Given User is authenticated

# Advisory Vulnerabilities
Scenario: Display vulnerabilities tied to a single advisory
    Given User visits Advisory details Page of "<advisoryName>" with type "<advisoryType>"
    Then User navigates to the Vulnerabilities tab on the Advisory Overview page
    Then Pagination of Vulnerabilities list works
    Then A list of all active vulnerabilites tied to the advisory should display
    And The "ID, Title, Discovery, Release, Score, CWE" information should be visible for each vulnerability
    And The vulnerabilities should be sorted by ID by default
    And User visits Vulnerability details Page of "<vulnerabilityID>" by clicking it

    Examples:
        | advisoryName    | vulnerabilityID | advisoryType |
        | CVE-2023-3223   | CVE-2023-3223   |     csaf     |
