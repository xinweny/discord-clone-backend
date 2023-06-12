import { RequestHandler } from 'express';
import VALIDATION_FIELDS from '../data/validationFields';

import handleValidationErrors from '../helpers/handleValidationErrors';

const validateFields = (fields: string[]): RequestHandler[] => {
  const validator = fields.map((fieldName: string) => VALIDATION_FIELDS[fieldName]);

  return [
    ...validator,
    handleValidationErrors,
  ];
}

export default validateFields;