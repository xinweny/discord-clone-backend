import cloudinary from '../config/cloudinary.config';

import formatDataUri from '../helpers/formatDataUri';

import getPublicId from './getPublicId';

const upload = async (file: Express.Multer.File, folderPath: string, url?: string) => {
  const dataUri = formatDataUri(file.buffer, file.mimetype);

  const extension = file.originalname.split('.').slice(-1)[0];

  const res = await cloudinary.uploader.upload(dataUri, {
    folder: `discord_clone/${folderPath}`,
    use_filename: true,
    resource_type: (extension === 'pdf') ? 'raw' : 'auto',
    ...(url && { public_id: getPublicId(url) }),
  });

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