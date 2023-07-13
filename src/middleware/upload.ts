import multer from 'multer';

import fileTypeFilter from '../helpers/fileTypeFilter';

const emoji = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 256000,
    files: 1,
  },
  fileFilter: fileTypeFilter(/jpeg|jpg|png|gif/),
}).single('emoji');

const attachments = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8000000,
    files: 10,
  }
}).array('attachments');

const avatar = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000,
    files: 1,
  },
  fileFilter: fileTypeFilter(/jpeg|jpg|png|gif/),
}).single('avatar');

const serverImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000,
    files: 1,
  },
  fileFilter: fileTypeFilter(/jpeg|jpg|png|gif/),
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
]);

export default {
  emoji,
  attachments,
  avatar,
  serverImages,
};