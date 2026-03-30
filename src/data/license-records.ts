import type { LicenseRecord } from "@/lib/domain/schemas";

export const licenseRecords: LicenseRecord[] = [
  {
    id: "license-demo-01",
    datasetSourceId: "ds-demo-placeholder",
    imageAssetId: "a0000001-0001-4000-8000-000000000001",
    licenseType: "CC-BY-SA-4.0",
    spdxId: "CC-BY-SA-4.0",
    attribution: "DermTool Team (demo placeholder)",
    sourceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    restrictions: [
      "Replace with properly licensed clinical photography before production use",
    ],
    notes:
      "Placeholder reference for demo/development. Replace with properly licensed clinical photography before production use.",
  },
  {
    id: "license-demo-02",
    datasetSourceId: "ds-demo-placeholder",
    imageAssetId: "a0000001-0003-4000-8000-000000000001",
    licenseType: "CC-BY-SA-4.0",
    spdxId: "CC-BY-SA-4.0",
    attribution: "DermTool Team (demo placeholder)",
    sourceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    restrictions: [
      "Replace with properly licensed clinical photography before production use",
    ],
    notes:
      "Placeholder reference for demo/development. Skin cancer images require attention to patient consent and de-identification.",
  },
  {
    id: "license-demo-03",
    datasetSourceId: "ds-demo-placeholder",
    imageAssetId: "a0000001-0005-4000-8000-000000000001",
    licenseType: "CC-BY-SA-4.0",
    spdxId: "CC-BY-SA-4.0",
    attribution: "DermTool Team (demo placeholder)",
    sourceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    restrictions: [
      "Replace with properly licensed clinical photography before production use",
    ],
    notes:
      "Placeholder reference for demo/development. Prioritize skin tone diversity to represent conditions across all Fitzpatrick types.",
  },
  {
    id: "license-demo-04",
    datasetSourceId: "ds-demo-placeholder",
    imageAssetId: "a0000001-0007-4000-8000-000000000001",
    licenseType: "CC-BY-SA-4.0",
    spdxId: "CC-BY-SA-4.0",
    attribution: "DermTool Team (demo placeholder)",
    sourceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    restrictions: [
      "Replace with properly licensed clinical photography before production use",
    ],
    notes:
      "Placeholder reference for demo/development. Facial photographs are sensitive - ensure eyes are obscured or patient has provided specific written consent.",
  },
  {
    id: "license-demo-05",
    datasetSourceId: "ds-demo-placeholder",
    imageAssetId: "a0000001-0009-4000-8000-000000000001",
    licenseType: "CC-BY-SA-4.0",
    spdxId: "CC-BY-SA-4.0",
    attribution: "DermTool Team (demo placeholder)",
    sourceUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    restrictions: [
      "Replace with properly licensed clinical photography before production use",
    ],
    notes:
      "Placeholder reference for demo/development. Consider partnering with DermNet NZ or ISIC Archive for production images.",
  },
];
