import sharp from "sharp";

async function getImageDimensions(buffer: Buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const { width, height, format } = metadata;

  if (!width || !height) {
    throw new Error("Could not get image dimensions");
  }

  const aspectRatio = width / height;

  return {
    width,
    height,
    aspectRatio,
    format,
  };
}

export default async function extractImageDimensions(imageUrl: string) {
  const arrayBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());
  const buffer = Buffer.from(arrayBuffer);
  const dimensions = await getImageDimensions(buffer);
  return { ...dimensions, arrayBuffer, buffer };
}
