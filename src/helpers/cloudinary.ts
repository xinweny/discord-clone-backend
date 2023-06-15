import cloudinary from '../config/cloudinary.config';

import getPublicId from './getPublicId';

const upload = async (file: string, folderPath: string, url?: string) => {
  const options = {
    folder: `discord_clone/${folderPath}`,
    use_filename: true,
    ...(url && { public_id: getPublicId(url) }),
  };

  const res = await cloudinary.uploader.upload(file, options);

  return res;
};

const deleteById = async (url: string) => {
  const publicId = getPublicId(url);
  const res = await cloudinary.uploader.destroy(publicId);

  return res;
};

const deleteByPrefix = async (folderPath: string) => {
  const res = await cloudinary.api.delete_resources_by_prefix(`discord_clone/${folderPath}`);

  return res;
};

export default {
  upload,
  deleteById,
  deleteByPrefix,
};