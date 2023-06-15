import { RequestHandler } from 'express';
import VALIDATION_RULES from '../data/validationRules';

import handleValidationErrors from '../helpers/handleValidationErrors';

const validateFields = (fields: string[]): RequestHandler[] => {
  const validator = fields.map((fieldName: string | number) => VALIDATION_RULES[fieldName]);

  return [
    ...validator,
    handleValidationErrors,
  ];
}

export default validateFields;