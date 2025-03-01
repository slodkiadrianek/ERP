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
      price: Joi.number().required(),
      quantity: Joi.number().required(),
    }),
  ),
  totalPrice: Joi.number().required(),
  totalAmount: Joi.number().required(),
  expectedDeliveryDate: Joi.date().required(),
  status: Joi.string()
    .valid("pending", "completed", "cancelled")
    .default("pending"),
  paymentStatus: Joi.string()
    .valid("paid", "unpaid", "partial")
    .default("unpaid"),
  warehouse: Joi.string().required(),
});

export const purchaseOrderId = Joi.object({
  id: Joi.string().required(),
});
export const purchaseOrderStatus = Joi.object({
  status: Joi.string().valid("completed", "cancelled").required(),
}).concat(purchaseOrderId);

export const purchaseOrderPaymentStatus = Joi.object({
  paymentStatus: Joi.string().valid("paid", "unpaid", "partial").required(),
}).concat(purchaseOrderId);
