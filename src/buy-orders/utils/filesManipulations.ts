import { extname } from 'path';

export const editFileName = (req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|docx)$/)) {
    return callback(
      new Error('Only files like: JPG, JPEG, PNG, GIF, PDF or DOCX is allowed.'),
      false,
    );
  }
  callback(null, true);
};
