import cloudinary from '../config/cloudinary.config';

import formatDataUri from '../helpers/formatDataUri';

import getPublicId from '../helpers/getPublicId';

const upload = async (file: Express.Multer.File, folderPath: string, url?: string) => {
  const dataUri = formatDataUri(file.buffer, file.mimetype);

  const ext = file.originalname.split('.').slice(-1)[0];

  const res = await cloudinary.uploader.upload(dataUri, {
    folder: `discord_clone/${folderPath}`,
    use_filename: true,
    resource_type: (ext === 'pdf') ? 'raw' : 'auto',
    ...(url && { public_id: getPublicId(url, ext === 'pdf') }),
  });

  return res;
};

const deleteById = async (url: string) => {
  const publicId = getPublicId(url);
  const res = await cloudinary.uploader.destroy(publicId);

  return res;
};

const deleteFolder = async (folderPath: string) => {
  const path = `discord_clone/${folderPath}/`;

  const prefix = await Promise.all(
    ['image', 'raw', 'video'].map(
      resourceType => cloudinary.api.delete_resources_by_prefix(path, { resource_type: resourceType })
    )
  );

  const folder = await cloudinary.api.delete_folder(path);

  return { prefix, folder };
};

export default {
  upload,
  deleteById,
  deleteFolder,
};