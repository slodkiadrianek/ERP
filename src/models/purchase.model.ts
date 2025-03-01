import { Document, Schema, model, Types, Model } from "mongoose";
import { IProduct } from "./product.model.js";
import { IWarehouse } from "./warehouse.model.js";
export interface ISupplier extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: {
    country: string;
    city: string;
    street: string;
    code: number;
    number: number;
  };
  paymentTerms: string;
}

export interface IPurchaseOrder extends Document {
  supplier: ISupplier["_id"];
  items: {
    product: IProduct["_id"];
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  totalAmount: number;
  expectedDeliveryDate: Date;
  status: "pending" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "partial";
  warehouse: IWarehouse["_id"];
}

const supplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      code: { type: Number, required: true },
      number: { type: Number, required: true },
    },
    paymentTerms: { type: String },
  },
  { timestamps: true },
);

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "received", "cancelled"],
      default: "pending",
    },
    expectedDeliveryDate: { type: Date },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
  },
  { timestamps: true },
);

export const Supplier: Model<ISupplier> = model<ISupplier>(
  "Supplier",
  supplierSchema,
);
export const PurchaseOrder: Model<IPurchaseOrder> = model<IPurchaseOrder>(
  "PurchaseOrder",
  purchaseOrderSchema,
);
