import { api } from '../../../core/api/client';
 '../../../../core/api/client';

import { CURRENT_USER, USER_API_BASE_URL } from "../../../core/config/url";

export const getCurrentUser = async () => {
  const result = await api.get(CURRENT_USER);
  return result.data;
};

export const updateAvatar = async (avatarUrl: string) => {
  const result = await api.put(`${USER_API_BASE_URL}/avatar`, { avatarUrl });
  return result.data;
};


import imageCompression from "browser-image-compression";

export const uploadImage = async (file: File): Promise<string> => {
  // 1. Optimize/Resize image before upload
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(file, options);

  // 2. Get Signed Upload details from Backend
  const res = await api.post<{
    signature: string; timestamp: number; cloudName: string; apiKey: string; folder: string;
  }>("/upload/url", {
    folder: "posts",
  });

  const { signature, timestamp, cloudName, apiKey, folder } = res.data;

  // 3. Upload directly to Cloudinary
  const formData = new FormData();
  formData.append("file", compressedFile);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const uploadData = await uploadRes.json();

  // return the final secure URL for the frontend to show the image directly
  return uploadData.secure_url; 
};


