/**
 * Cloudinary Unsigned Upload Service
 * 
 * This service handles direct browser-to-Cloudinary uploads using the 
 * Unsigned Upload API.
 */

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      `Cloudinary configuration missing. 
       Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET 
       in the AI Studio Settings variables.`
    );
  }

  // Initial progress
  if (onProgress) onProgress(10);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log(`[Cloudinary] Starting upload to ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (onProgress) onProgress(50);

    const data = await response.json();

    if (!response.ok) {
      console.error('[Cloudinary] Upload Error response:', data);
      const message = data.error?.message || 'Upload failed';
      
      // Specific troubleshooting for common errors
      if (message.includes('Unknown API key')) {
        // Double check if they swapped the variables
        if (cloudName === 'app_uploads' || cloudName.includes('preset')) {
          throw new Error(
            `SWAPPED VARIABLES DETECTED: You have put your Upload Preset ("${cloudName}") into the VITE_CLOUDINARY_CLOUD_NAME field. 
             Please go to Settings > Variables and swap them:
             1. VITE_CLOUDINARY_CLOUD_NAME should be "dapoidzbw"
             2. VITE_CLOUDINARY_UPLOAD_PRESET should be "app_uploads"`
          );
        }
        throw new Error(
          `Cloudinary Error: "Unknown API key". This means your Cloud Name "${cloudName}" is likely incorrect. 
           Check Settings > Variables and verify it matches your Cloudinary Dashboard's "Cloud name" exactly.`
        );
      }
      
      if (message.includes('Upload preset not found')) {
        throw new Error(
          `Cloudinary Error: Preset "${uploadPreset}" not found. 
           Ensure you created an "Unsigned" preset in Settings > Upload.`
        );
      }

      throw new Error(message);
    }

    console.log('[Cloudinary] Success:', data.secure_url);
    if (onProgress) onProgress(100);
    return data.secure_url;
  } catch (error: any) {
    console.error('[Cloudinary] Fatal Error:', error);
    throw error;
  }
};
