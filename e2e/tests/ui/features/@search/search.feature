Feature: Search
	As a Devsecops Engineer
	I want to perform searching across vulnerabilities, SBOMs and packages, specific searches for CVE IDs, SBOM titles, package names and show results that are easy to navigate to the specific item of interest.

Background:
	Given User is authenticated
	And User is on the Search page

Scenario: User visits search page without filling anything
	Then a total number of "SBOMs" should be visible in the tab
	And a total number of "Packages" should be visible in the tab
	And a total number of "Vulnerabilities" should be visible in the tab
	And a total number of "Advisories" should be visible in the tab

Scenario Outline: User toggles the "<types>" list and manipulates the list
 	When User selects the Tab "<types>"
	Then the "<types>" list should have the "<filters>" filter set
	And the "<types>" list should be sortable
	And the "<types>" list should be limited to 10 items
	And the user should be able to switch to next "<types>" items
	And the user should be able to increase pagination for the "<types>"
	And First column on the search results should have the link to "<types>" explorer pages

	Examples:
	|types|filters|
	|SBOMs|Created on|
	|Packages|Type, Architecture|
	|Vulnerabilities|CVSS, Published|
	|Advisories|Revision|

Scenario Outline: Download Links on the "<types>" Search Result list
	When User selects the Tab "<types>"
	Then Tab "<types>" is visible
	And Download link should be available for the "<types>" list

        Examples:
	|types|
	|SBOMs|
	|Advisories|

Scenario Outline: Autofill shows results matched on <input>
	When user starts typing a "<input>" in the search bar
	Then the autofill dropdown should display items matching the "<input>"
	And the results should be limited to 5 suggestions

	Examples:
	|input|
	|quarkus|
	|CVE-2022|
	|policies|

Scenario: Search bar should not preview anything when no matches are found
	And user starts typing a "non-existent name" in the search bar
	Then The autofill drop down should not show any values

Scenario Outline: User searches for a specific "<types>"
 	When user types a "<type-instance>" in the search bar
 	And user presses Enter
	And User selects the Tab "<types>"
 	Then the "<types>" list should display the specific "<type-instance>"
	And the list should be limited to 10 items or less
 	And the user should be able to filter "<types>"
 	And user clicks on the "<type-instance>" "<types>" link
 	And the user should be navigated to the specific "<type-instance>" page

	Examples:
	|types|type-instance|
	|SBOMs|quarkus-bom|
	|Vulnerabilities|CVE-2022-45787|
	|Packages|quarkus|
	|Advisories|CVE-2022-45787|

# Related to TC-3248: Upload Advisory button should not appear on Search page
Scenario: Verify Upload Advisory button is not displayed on Search page
	When User navigates to "Search" page
	And User clicks on "Advisories" tab
	Then "Upload Advisory" button should not be displayed
