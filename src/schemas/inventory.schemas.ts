import Joi, { ObjectSchema } from "joi";

export const addProduct: ObjectSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
  }),
  description: Joi.string().required().messages({
    "string.base": "Description must be a string",
    "any.required": "Description is required",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),
  cost: Joi.number().required().messages({
    "number.base": "Cost must be a number",
    "any.required": "Cost is required",
  }),
  quantity: Joi.number().default(0).required().messages({
    "number.base": "Quantity must be a number",
    "any.required": "Quantity is required",
  }),
  minStockLevel: Joi.number().default(10).required().messages({
    "number.base": "MinStockLevel must be a number",
    "any.required": "MinStockLevel is required",
  }),
  volume: Joi.number().required().messages({
    "number.base": "Volume must be a number",
    "any.required": "Volume is required",
  }),
  category: Joi.string().required().messages({
    "string.base": "Category must be a string",
    "any.required": "Category is required",
  }),
  warehouse: Joi.string().required().messages({
    "string.base": "Warehouse must be a string",
    "any.required": "Warehouse is required",
  }),
});

export const productId: ObjectSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "Id must be a string",
    "any.required": "Id is required",
  }),
});
