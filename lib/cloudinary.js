import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "bungoma_tours_assets";

/**
 * Upload a base64 or URL image to Cloudinary
 * @param {string} source - base64 data URI or remote URL
 * @param {string} publicIdPrefix - optional prefix for the public_id
 */
export async function uploadToCloudinary(source, publicIdPrefix = "attraction") {
  const result = await cloudinary.uploader.upload(source, {
    folder: cloudinaryFolder,
    public_id: `${publicIdPrefix}_${Date.now()}`,
    overwrite: true,
    transformation: [
      { width: 1280, height: 720, crop: "fill", gravity: "auto", quality: "auto:good" },
    ],
  });
  return result;
}

/**
 * Delete an image from Cloudinary by public_id
 * @param {string} publicId - Cloudinary public_id
 */
export async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

/**
 * Extract public_id from a Cloudinary secure_url
 * @param {string} url - Cloudinary secure URL
 */
export function extractPublicId(url) {
  if (!url) return null;
  // e.g. https://res.cloudinary.com/cloud/image/upload/v123456/folder/file.jpg
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i);
  return match ? match[1] : null;
}

export default cloudinary;
