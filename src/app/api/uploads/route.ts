import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getUploadSession } from "@/lib/upload-session";

const uploadPrefix = "Misc and Other/MiscUploads";
const maxFiles = 20;
const maxFileSize = 15 * 1024 * 1024;
const maxTotalSize = 50 * 1024 * 1024;
const imageExtensions: Record<string, string> = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await getUploadSession())) {
    return NextResponse.json(
      { error: "Please sign in to upload photos." },
      { status: 401 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > maxTotalSize + 1024 * 1024) {
    return NextResponse.json(
      { error: "The selected photos exceed the upload size limit." },
      { status: 413 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Unable to read the selected photos." },
      { status: 400 },
    );
  }

  const selectedFiles = formData.getAll("files");
  if (
    selectedFiles.length === 0 ||
    selectedFiles.length > maxFiles
  ) {
    return NextResponse.json(
      { error: `Select between 1 and ${maxFiles} photos to upload.` },
      { status: 400 },
    );
  }

  const files = selectedFiles.filter(
    (file): file is File => typeof file !== "string",
  );
  if (files.length !== selectedFiles.length) {
    return NextResponse.json(
      { error: "Only image files can be uploaded." },
      { status: 400 },
    );
  }
  const totalSize = files.reduce((size, file) => size + file.size, 0);
  if (totalSize > maxTotalSize) {
    return NextResponse.json(
      { error: "The selected photos exceed the total upload size limit." },
      { status: 413 },
    );
  }

  for (const file of files) {
    if (!imageExtensions[file.type] || file.size === 0) {
      return NextResponse.json(
        { error: "Only supported, non-empty image files can be uploaded." },
        { status: 400 },
      );
    }
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "Each photo must be 15 MB or smaller." },
        { status: 413 },
      );
    }
  }

  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } =
    process.env;
  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_BUCKET_NAME) {
    console.error("AWS upload is not configured.");
    return NextResponse.json(
      { error: "Photo uploads are not configured." },
      { status: 500 },
    );
  }

  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  let uploadedCount = 0;
  let failedCount = 0;
  try {
    for (const file of files) {
      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: `${uploadPrefix}/${randomUUID()}.${imageExtensions[file.type]}`,
            Body: new Uint8Array(await file.arrayBuffer()),
            ContentType: file.type,
          }),
        );
        uploadedCount += 1;
      } catch (error) {
        console.error("Failed to upload a photo to S3.", error);
        failedCount += 1;
      }
    }
  } finally {
    s3Client.destroy();
  }

  return NextResponse.json(
    { uploadedCount, failedCount },
    { status: failedCount > 0 ? 207 : 200 },
  );
}
