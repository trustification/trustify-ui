Feature: Search
	As a Devsecops Engineer
	I want to perform searching across vulnerabilities, SBOMs and packages, specific searches for CVE IDs, SBOM titles, package names and show results that are easy to navigate to the specific item of interest.

Background:
	Given User is using an instance of the TPA Application
	And User has successfully uploaded an SBOM
	And User has successfully uploaded a vulnerability dataset
	And User has successfully uploaded an advisory dataset
	And User is on the Search page

Scenario: User visits search page without filling anything
	When user starts typing a "" in the search bar
	And user presses Enter
	Then a total number of "SBOMs" should be visible in the tab
	And a total number of "Packages" should be visible in the tab
	And a total number of "CVEs" should be visible in the tab
	And a total number of "Advisories" should be visible in the tab

Scenario Outline: User toggles the <types> list and manipulates the list
	When User navigates to Search results page 
	And user toggles the <types> list
	Then the <types> list should have specific filter set
	And the user should be able to filter <types>
	And the <types> list should be sortable
	And the <types> list should be limited to 10 items
	And the user should be able to switch to next <types> items
	And the user should be able to increase pagination for the <types>
	And First column on the search results should have the link to <types> explorer pages

Scenario Outline: Download Links on the <types> Search Result list
	When User navigates to Search Results page
	And Clicks on <types> tab
	Then <types> list should be listed
	And Download link should be available at the end of the rows
	
        Examples:
	|types|
	|SBOMs|
	|Advisories|

	Examples:
	|types|
	|SBOMs|
	|Packages|
	|CVEs|
	|Advisories|

Scenario Outline: Autofill shows results matched on <input> 
	When user starts typing a <input> in the search bar  
	Then the autofill dropdown should display items matching the <input> 
	And the results should be limited to 5 suggestions

	Examples:
	|input|
	|SBOM name|
	|CVE ID|
	|CVE description|

Scenario: Autofill should not match any packages
	When user starts typing a "package name" in the search bar  
	Then the autofill dropdown should not display any packages
	And the results should be limited to 5 suggestions

Scenario: Search bar should not preview anything when no matches are found 
	When user starts typing a "non-existent name" in the search bar
	Then The autofill drop down should not show any values

Scenario Outline: User searches for a specific <type> 
	When user types a <type-name> in the search bar
	And user presses Enter
	And user toggles the <types> list
	Then the <types> list should display the specific <type-name> 
	And the user should be able to filter <types> 
	And user clicks on the "<type>" name
	And the user should be navigated to the specific "<type>" page 

	Examples:
	|type|types|type-name|
	|SBOM|SBOMs|SBOM name|
	|CVE|CVEs|CVE ID|
	|package|Packages|package name|
	|advisory|Advisories|advisory name|
