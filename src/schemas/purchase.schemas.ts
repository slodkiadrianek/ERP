import Joi from "joi";

export const addSupplier = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  address: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    code: Joi.number().required(),
    number: Joi.string().required(),
  }),
  paymentTerms: Joi.string()
    .regex(/NET\d+/)
    .required(),
});

export const supplierId = Joi.object({
  id: Joi.string().required(),
});

export const addPurchaseOrder = Joi.object({
  supplier: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
    }),
  ),
  totalAmount: Joi.number().required(),
  expectedDeliveryDate: Joi.date().required(),
  status: Joi.string()
    .valid("pending", "completed", "cancelled")
    .default("pending")
    .required(),
  paymentStatus: Joi.string()
    .valid("paid", "unpaid", "partial")
    .default("unpaid")
    .required(),
  warehouse: Joi.string().required(),
});

export const purchaseOrderId = Joi.object({
  id: Joi.string().required(),
});
