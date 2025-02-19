import Joi, { ObjectSchema } from "joi";

const registerEmployee: ObjectSchema = Joi.object({
  firstname: Joi.string().required().messages({
    "any.required": "Firstname is required!",
    "string.base": "Firstname must be a string!",
  }),
  lastname: Joi.string().required().messages({
    "any.required": "Lastname is required!",
    "string.base": "Lastname must be a string!",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .required()
    .messages({
      "any.required": "Password is required",
      "string.base": "Password must be a string",
      "string.min": "Password must contain at least 8 characters",
      "string.max": "Password can contain only 30 characters",
      "any.pattern":
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character. It must be at least 8 characters long.",
    }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid ",
  }),
  role: Joi.string().required().messages({
    "any.required": "Role is required",
    "string.base": "Role must be a string",
  }),
});

const loginEmployee: ObjectSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid ",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .required()
    .messages({
      "any.required": "Password is required",
      "string.base": "Password must be a string",
      "string.min": "Password must contain at least 8 characters",
      "string.max": "Password can contain only 30 characters",
      "string.pattern":
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character. It must be at least 8 characters long.",
    }),
});
export { loginEmployee, registerEmployee };
