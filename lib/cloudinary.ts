import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  duration?: number
}

export async function uploadToCloudinary(file: File, folder = "dfalmez-gallery"): Promise<CloudinaryUploadResult> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result as CloudinaryUploadResult)
          }
        },
      )
      .end(buffer)
  })
}

export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string
    format?: string
  } = {},
) {
  const { width, height, quality = "auto", format = "auto" } = options

  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    format,
    crop: "fill",
    gravity: "auto",
  })
}

export function getVideoThumbnail(publicId: string, options: { width?: number; height?: number } = {}) {
  const { width = 400, height = 300 } = options

  return cloudinary.url(publicId, {
    resource_type: "video",
    width,
    height,
    crop: "fill",
    quality: "auto",
    format: "jpg",
  })
}

export default cloudinary
