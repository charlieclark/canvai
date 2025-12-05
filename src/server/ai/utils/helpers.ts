import fs from "fs-extra";
import Replicate from "replicate";
import OpenAI from "openai";
import { put, type PutCommandOptions } from "@vercel/blob";
import { fileTypeFromBuffer } from "file-type";
import { env } from "@/env";

export type ImageStream = ReadableStream<Uint8Array>;

export const openAIclient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

export const BlobOptions: PutCommandOptions = {
  addRandomSuffix: true,
  access: "public",
  token: env.BLOB_READ_WRITE_TOKEN,
};

export async function streamToBuffer(stream: ImageStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export const uploadLocalFile = async (
  buffer: Buffer,
  defaultExtension = "png",
): Promise<string> => {
  const fileType = await fileTypeFromBuffer(buffer);
  const extension = fileType?.ext || defaultExtension;

  const { url } = await put(`questas/upload.${extension}`, buffer, BlobOptions);

  console.log(url);

  return url;
};

export const uploadImageStream = async (
  stream: ImageStream,
): Promise<string> => {
  const buffer = await streamToBuffer(stream);
  return uploadLocalFile(buffer);
};

export const remoteAssetToBuffer = async (assetUrl: string) => {
  const response = await fetch(assetUrl);
  const buffer = await response.arrayBuffer();

  return Buffer.from(buffer);
};

export const remoteImageToFile = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const fileType = await fileTypeFromBuffer(buffer);

  const file = new File([buffer], `file.${fileType?.ext}`, {
    type: fileType?.mime,
    lastModified: Date.now(),
  });

  return file;
};

export const blobToBuffer = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};
