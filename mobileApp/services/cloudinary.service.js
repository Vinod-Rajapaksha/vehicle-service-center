import axios from 'axios';

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryService = {
  uploadImage: async (uri) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      console.error('Cloudinary configuration missing');
      throw new Error('Cloudinary configuration missing');
    }

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.create().post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  },
};
