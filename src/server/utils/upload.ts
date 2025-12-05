import { env } from "@/env";
import { put } from "@vercel/blob";

export async function uploadImageFromBuffer(
  buffer: ArrayBuffer,
  contentType: string,
): Promise<string> {
  try {
    const blob = new Blob([buffer], { type: contentType });
    const filename = `image-${Date.now()}.${contentType.split("/")[1] || "jpg"}`;

    const { url } = await put(filename, blob, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
    });

    return url;
  } catch (error) {
    console.error(
      "Error uploading image:",
      error instanceof Error ? error.message : String(error),
    );
    throw new Error("Failed to upload image");
  }
}

export async function downloadImage(imageUrl: string) {
  // Download the image
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("Failed to download image");

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const buffer = await response.arrayBuffer();

  return {
    buffer,
    contentType,
  };
}

export async function downloadAndUploadImage(
  imageUrl: string,
): Promise<string> {
  try {
    const { buffer, contentType } = await downloadImage(imageUrl);

    // Upload to our storage
    return await uploadImageFromBuffer(buffer, contentType);
  } catch (error) {
    console.error(
      "Error processing image:",
      error instanceof Error ? error.message : String(error),
    );
    return ""; // Return empty string if upload fails
  }
}
