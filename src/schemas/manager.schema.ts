import Joi, {ObjectSchema} from "joi"
import { title } from "process"

export const createNewTask:ObjectSchema = Joi.object({
    title: Joi.string().required().messages({
        "any.required": "Title is required",
        "string.base": "Title must be a string"
    }),
    description: Joi.string().min(20).required().messages({
        "any.required": "Description is required",
        "string.base": "Description must be a string",
        "string.min": "Description must contain at least 20 characters"
    }),
    assignedEmployees: Joi.array().items(Joi.string().messages({
        "string.base": "Employee ID must be a string",
    })).required()
    .messages({
      "any.required": "Employee IDs are required.",
    }),
})