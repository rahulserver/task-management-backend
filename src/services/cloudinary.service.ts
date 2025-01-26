import { v2 as cloudinary } from 'cloudinary';
import { ICloudinaryUploadResponse } from '../interfaces/cloudinary.interface';
import { ApiError } from '../utils/api-error';

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    imageData: string,
    publicId: string,
  ): Promise<ICloudinaryUploadResponse> {
    try {
      const result = await cloudinary.uploader.upload(imageData, {
        public_id: publicId,
        resource_type: 'image',
        format: 'jpg',
        transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
      });

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        resourceType: result.resource_type,
      };
    } catch (error) {
      throw new ApiError(500, 'Failed to upload image to Cloudinary');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new ApiError(500, 'Failed to delete image from Cloudinary');
    }
  }
}
