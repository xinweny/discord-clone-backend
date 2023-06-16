import multer from 'multer';

import fileTypeFilter from '../helpers/fileTypeFilter';

const emoji = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 256000,
    files: 1,
  },
  fileFilter: fileTypeFilter(/jpeg|jpg|png|gif/),
}).single('file');

const attachments = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8000000,
    files: 10,
  }
}).array('files');

export default {
  emoji,
  attachments,
};