import { v2 as cloudinary } from "cloudinary"

// Check if Cloudinary environment variables are configured
const isCloudinaryConfigured = 
  typeof process.env.CLOUDINARY_CLOUD_NAME === "string" &&
  process.env.CLOUDINARY_CLOUD_NAME.length > 0 &&
  typeof process.env.CLOUDINARY_API_KEY === "string" &&
  process.env.CLOUDINARY_API_KEY.length > 0 &&
  typeof process.env.CLOUDINARY_API_SECRET === "string" &&
  process.env.CLOUDINARY_API_SECRET.length > 0

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    // Add timeouts to prevent hanging connections
    upload_timeout: 60000,
    timeout: 60000,
  })
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  duration?: number
}

export async function uploadToCloudinary(file: File, folder = "dflamez-gallery"): Promise<CloudinaryUploadResult> {
  // Check if Cloudinary is properly configured
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not properly configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.")
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) {
          // Handle network errors specifically
          if (error.message && error.message.includes('getaddrinfo EAI_AGAIN')) {
            reject(new Error("Network connection error: Unable to reach Cloudinary servers. Please check your internet connection and try again."))
          } else if (error.code === 'EAI_AGAIN') {
            reject(new Error("DNS lookup failed: Unable to resolve Cloudinary domain. Please check your network connection and DNS settings."))
          } else {
            reject(new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`))
          }
        } else if (!result) {
          reject(new Error("Cloudinary upload failed: No result returned from Cloudinary"))
        } else {
          resolve(result as CloudinaryUploadResult)
        }
      },
    )
    
    // Handle stream errors
    uploadStream.on('error', (error) => {
      reject(new Error(`Stream error during upload: ${error.message || 'Unknown stream error'}`))
    })
    
    // End the stream with our buffer
    uploadStream.end(buffer)
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
  // Check if Cloudinary is properly configured
  if (!isCloudinaryConfigured) {
    // Return a placeholder image if Cloudinary is not configured
    return "https://placehold.co/600x400?text=Cloudinary+Not+Configured"
  }

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
  // Check if Cloudinary is properly configured
  if (!isCloudinaryConfigured) {
    // Return a placeholder image if Cloudinary is not configured
    return "https://placehold.co/600x400?text=Cloudinary+Not+Configured"
  }

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