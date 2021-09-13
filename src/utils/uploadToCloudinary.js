import {
  CloudinaryUploadPreset,
  CloudinaryUploadUrl
} from 'src/components/config/config';
import axios from 'axios';

const uploadToCloudinary = async (imageToUpload) => {
  try {
    const formData = new FormData();
    formData.append('file', imageToUpload);
    formData.append('upload_preset', CloudinaryUploadPreset);
    const { data } = await axios.post(CloudinaryUploadUrl, formData);
    return data.url;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default uploadToCloudinary;
