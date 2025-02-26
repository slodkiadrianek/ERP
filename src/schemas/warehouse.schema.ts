import Joi, { ObjectSchema } from "joi";

export const newWarehouseSchema: ObjectSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": `Name should be a type of string`,
    "any.required": "Name is required",
  }),
  location: Joi.object({
    country: Joi.string().required().messages({
      "string.base": `Country should be a type of string`,
      "any.required": "Country is required",
    }),
    city: Joi.string().required().messages({
      "string.base": `City should be a type of string`,
      "any.required": "City is required",
    }),
    street: Joi.string().required().messages({
      "string.base": `Street should be a type of string`,
      "any.required": "Street is required",
    }),
    code: Joi.string().required().messages({
      "string.base": `Code should be a type of string`,
      "any.required": "Code is required",
    }),
    number: Joi.number().required().messages({
      "number.base": `Number should be a type of number`,
      "any.required": "Number is required",
    }),
  }),
  capacity: Joi.number().required().messages({
    "number.base": `Capacity should be a type of number`,
    "any.required": "Capacity is required",
  }),
});

export const warehouseId: ObjectSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": `City should be a type of string`,
    "any.required": "City is required",
  }),
});
