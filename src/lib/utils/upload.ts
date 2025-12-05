export interface BlobResponse {
  url: string;
  error?: string;
}

/**
 * Uploads a file to Vercel Blob storage via server route
 */
export async function uploadImage(file: File): Promise<string> {
  const filename = encodeURIComponent(file.name);
  const res = await fetch(`/api/upload?filename=${filename}`, {
    method: "POST",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  const data = (await res.json()) as BlobResponse;

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to upload file");
  }

  return data.url;
}

export async function uploadImageDocument(file: File) {
  const imageUrl = await uploadImage(file);

  const img = new Image();

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const aspectRatio = img.width / img.height;

  return { imageUrl, aspectRatio };
}
