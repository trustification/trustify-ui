@vendor-remediation
Feature: Vendor (LW/RHLW) Remediation Recommendations
    As a security analyst
    I want to see vendor backport and upstream remediation recommendations across the SBOM and package views
    So that I can identify which fixed versions resolve each vulnerability

    Background: Authentication
        Given User is authenticated

    @slow
    Scenario Outline: Remediation recommendations are surfaced across SBOM and package views
        Given An ingested SBOM "<sbomName>" is available
        When User visits SBOM details Page of "<sbomName>"
        When User selects the Tab "Packages"
        Then The Packages tab shows the "Remediations" column
        Then The Packages tab lists package "<packageName>" version "<packageVersion>"
        Given User is on the Vulnerabilities tab with "100" rows per page for SBOM "<sbomName>"
        Then The Vulnerabilities tab shows the "Remediations" column
        Then Expanding vulnerability "<targetCve>" shows remediations "<targetChips>" for package "<packageName>"
        When User visits the Package list filtered by "<packageName>"
        Then The Package list shows the "Remediations" column
        Then The Package list lists package "<packageName>" version "<packageVersion>"
        Given User visits Vulnerability details Page of "<targetCve>"
        Then The SBOM "<sbomName>" is listed as "Affected" under the vulnerability

        Examples:
            | sbomName                            | packageName   | packageVersion    | targetCve      | targetChips                    |
            | springmvc-cve-2023-20860-scenario1  | spring-webmvc | 5.3.15            | CVE-2023-20860 | 5.3.18.rhlw-00010,5.3.26,6.0.7 |
            | springmvc-cve-2023-20860-scenario2  | spring-webmvc | 5.3.18            | CVE-2023-20860 | 5.3.18.rhlw-00010,5.3.26,6.0.7 |
            | springmvc-cve-2023-20860-scenario3  | spring-webmvc | 5.3.22            | CVE-2023-20860 | 5.3.26,6.0.7                   |
            | springmvc-cve-2023-20860-scenario4  | spring-webmvc | 5.2.22            | CVE-2023-20860 | 5.3.18.rhlw-00010              |
            | springmvc-cve-2023-20860-scenario5  | spring-webmvc | 5.3.27            | CVE-2024-38816 | 6.1.13                         |
            | springmvc-cve-2023-20860-scenario5a | spring-webmvc | 6.0.8             | CVE-2024-38816 | 6.1.13                         |
            | springmvc-cve-2023-20860-scenario7  | spring-webmvc | 5.3.15            | CVE-2023-20860 | 5.3.18.rhlw-00010,5.3.26,6.0.7 |
            | springmvc-cve-2023-20860-scenario6  | spring-webmvc | 5.3.18.rhlw-00010 | CVE-2024-38819 | 6.1.14                         |

    Scenario Outline: Two-package SBOM correlates remediations to each affected dependency
        Given User is on the Vulnerabilities tab with "100" rows per page for SBOM "<sbomName>"
        Then Expanding vulnerability "<targetCve>" shows remediations "<firstChips>" for package "<firstPackage>"
        Then Expanding vulnerability "<targetCve>" shows remediations "<secondChips>" for package "<secondPackage>"

        Examples:
            | sbomName                           | targetCve      | firstPackage  | firstChips                     | secondPackage | secondChips  |
            | springmvc-cve-2023-20860-scenario7 | CVE-2023-20860 | spring-webmvc | 5.3.18.rhlw-00010,5.3.26,6.0.7 | spring        | 5.3.26,6.0.7 |

    Scenario Outline: Only the upstream fix is recommended for CVEs the vendor backport does not address
        Given User is on the Vulnerabilities tab with "100" rows per page for SBOM "<sbomName>"
        Then Expanding vulnerability "<cve>" shows remediations "<chips>" for package "spring-webmvc"

        Examples:
            | sbomName                            | cve            | chips  |
            | springmvc-cve-2023-20860-scenario6  | CVE-2024-38819 | 6.1.14 |
            | springmvc-cve-2023-20860-scenario6  | CVE-2025-41242 | 6.2.10 |

    Scenario Outline: Package details shows the per-CVE remediation recommendation
        When User visits the Vulnerabilities tab of package "<packageName>" version "<packageVersion>"
        Then The package Vulnerabilities tab shows the "Remediations" column
        Then The package Vulnerabilities tab shows per-CVE remediations "<perCveRemediations>"

        Examples:
            | packageName   | packageVersion    | perCveRemediations                                                                                                                                                 |
            | spring-webmvc | 5.3.15            | CVE-2022-22965=5.2.20.RELEASE,5.3.18;CVE-2023-20860=5.3.18.rhlw-00010,5.3.26,6.0.7;CVE-2024-38816=5.3.18.rhlw-00010,6.1.13;CVE-2024-38819=6.1.14;CVE-2025-41242=6.2.10 |
            | spring-webmvc | 5.3.22            | CVE-2023-20860=5.3.26,6.0.7;CVE-2024-38816=6.1.13;CVE-2024-38819=6.1.14;CVE-2025-41242=6.2.10                                                                       |
            | spring-webmvc | 5.2.22            | CVE-2023-20860=5.3.18.rhlw-00010;CVE-2024-38816=5.3.18.rhlw-00010;CVE-2024-38819=6.1.14                                                                             |
            | spring-webmvc | 5.3.27            | CVE-2024-38816=6.1.13;CVE-2024-38819=6.1.14;CVE-2025-41242=6.2.10                                                                                                  |
            | spring-webmvc | 6.0.8             | CVE-2024-38816=6.1.13;CVE-2024-38819=6.1.14;CVE-2025-41242=6.2.10                                                                                                  |
            | spring-webmvc | 5.3.18.rhlw-00010 | CVE-2023-20860=Applied;CVE-2024-38816=Applied;CVE-2024-38819=6.1.14;CVE-2025-41242=6.2.10 |
            | spring-webmvc | 5.3.18            | CVE-2023-20860=5.3.18.rhlw-00010,5.3.26,6.0.7;CVE-2024-38816=5.3.18.rhlw-00010,6.1.13;CVE-2024-38819=6.1.14;CVE-2025-41242=6.2.10                                   |

    Scenario Outline: Remediation report impact summary and package recommendations
        Given An ingested SBOM "<sbomName>" is available
        When User navigates to remediation report for SBOM "<sbomName>"
        Then The report shows "<sbomsWithRemediations>" SBOM with remediations out of "1" total
        Then The report shows "<addressablePackages>" addressable packages
        Then The report shows "<coverage>" percent coverage
        Then The packages table has "<tableRows>" rows
        Then The packages table shows package "<packageName>" version "<currentVersion>" recommended "<recommendedVersion>" addressing "<cves>" found in "<foundIn>"

        Examples:
            | sbomName                            | sbomsWithRemediations | addressablePackages | coverage | tableRows | packageName   | currentVersion    | recommendedVersion    | cves                             | foundIn                             |
            | springmvc-cve-2023-20860-scenario2  | 1                     | 1                   | 100      | 1         | spring-webmvc | 5.3.18            | 5.3.18.rhlw-00010     | CVE-2023-20860,CVE-2024-38816    | springmvc-cve-2023-20860-scenario2 |
            | springmvc-cve-2023-20860-scenario1  | 0                     | 0                   | 0        | 0         |               |                   |                       |                                  |                                     |
            | springmvc-cve-2023-20860-scenario3  | 0                     | 0                   | 0        | 0         |               |                   |                       |                                  |                                     |
            | springmvc-cve-2023-20860-scenario4  | 0                     | 0                   | 0        | 0         |               |                   |                       |                                  |                                     |
            | springmvc-cve-2023-20860-scenario5  | 0                     | 0                   | 0        | 0         |               |                   |                       |                                  |                                     |
            | springmvc-cve-2023-20860-scenario5a | 0                     | 0                   | 0        | 0         |               |                   |                       |                                  |                                     |
            | springmvc-cve-2023-20860-scenario6  | 0                     | 0                   | 0        | 0         |               |                   |                       |                                  |                                     |
            | springmvc-cve-2023-20860-scenario7  | 0                     | 0                   | 0        | 0         |               |                   |                       |                                  |                                     |
