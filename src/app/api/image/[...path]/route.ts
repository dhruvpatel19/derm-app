import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path;

  // Decode each segment (the storagePath is encoded as a single segment by resolveImageUrl)
  const decoded = segments.map((s) => decodeURIComponent(s));

  // The storage path may arrive as a single encoded segment like "data/datasets/pad-ufes-20/..."
  // Split it on "/" in case the whole path was encoded as one segment
  const parts = decoded.flatMap((s) => s.split("/"));
  const relativeParts =
    parts[0] === "data" && parts[1] === "datasets" ? parts.slice(2) : parts;
  const datasetRoot = path.resolve(
    path.join(/* turbopackIgnore: true */ process.cwd(), "data", "datasets")
  );

  const normalizedFilePath = path.resolve(datasetRoot, ...relativeParts);

  // Security: ensure the path is within allowed directories
  if (!normalizedFilePath.startsWith(datasetRoot)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const buffer = fs.readFileSync(normalizedFilePath);
    const ext = path.extname(normalizedFilePath).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "application/octet-stream";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
