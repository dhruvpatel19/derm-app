/**
 * Resolve the display URL for an image asset based on its storage mode.
 */
export function resolveImageUrl(asset: {
  storageMode: string;
  storagePath: string;
  externalUrl?: string;
}): string | null {
  if (asset.storageMode === "remote_url" && asset.externalUrl) {
    return asset.externalUrl; // SCIN GCS URLs
  }
  if (asset.storageMode === "local") {
    const padDatasetBaseUrl = process.env.NEXT_PUBLIC_PAD_DATASET_BASE_URL?.trim();
    if (padDatasetBaseUrl) {
      const preferredPadPrefix = "data/datasets/pad-ufes-20/images/";
      const legacyPadPrefix = "data/datasets/pad-ufes-20/";
      let relativePath = asset.storagePath.replace(/^\/+/, "");

      if (relativePath.startsWith(preferredPadPrefix)) {
        relativePath = relativePath.slice(preferredPadPrefix.length);
      } else if (relativePath.startsWith(legacyPadPrefix)) {
        relativePath = relativePath.slice(legacyPadPrefix.length);
      }

      const encodedPath = relativePath
        .split("/")
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join("/");

      return `${padDatasetBaseUrl.replace(/\/+$/, "")}/${encodedPath}`;
    }

    // Local development fallback for PAD images.
    return `/api/image/${encodeURIComponent(asset.storagePath)}`;
  }
  return null;
}
