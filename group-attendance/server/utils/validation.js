import Joi from 'joi';

export const schemas = {
  rollNumber: Joi.string().pattern(/^[A-Z0-9]{10}$/).required(),
  groupName: Joi.string().min(1).max(50).pattern(/^[a-zA-Z0-9\s-_]+$/).required(),
  rollNumbers: Joi.array().items(
    Joi.string().pattern(/^[A-Z0-9]{10}$/)
  ).min(1).max(20).required(),
  campus: Joi.string().valid('AEC', 'ACET', 'AGBS').default('AEC')
};

export function validateInput(schema, data) {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(`Validation failed: ${error.details[0].message}`);
  }
  return value;
}

export const groupSchema = Joi.object({
  name: schemas.groupName,
  rollNumbers: schemas.rollNumbers,
  campus: schemas.campus
});