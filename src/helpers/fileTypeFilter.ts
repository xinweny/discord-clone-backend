import multer from 'multer';

import path from 'path';

const fileTypeFilter = (fileTypes: RegExp) => {
  return function (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const extName = fileTypes.test(path.extname(file.originalname));

    const mimeType = fileTypes.test(file.mimetype);

    return cb(null, extName && mimeType);
  };
}

export default fileTypeFilter;