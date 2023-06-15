import multer from 'multer';

import fileTypeFilter from '../helpers/fileTypeFilter';

const uploadEmoji = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 256000,
    files: 1,
  },
  fileFilter: fileTypeFilter(/jpeg|jpg|png|gif/),
}).single('file');

export {
  uploadEmoji,
};