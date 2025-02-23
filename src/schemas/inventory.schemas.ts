import joi, {ObjectSchema} from 'joi';

const AddProduct = Joi.object({
  name: Joi.string().required().messages({
 `string.base`: `Name should be a type of string`,
    'any.required': `Name is required`, 
  })
})
