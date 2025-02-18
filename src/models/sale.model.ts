import { Document, Schema, model } from "mongoose";
import { IProduct } from "./product.model.js";
import { ICustomer } from "./customer.model.js";
import { IWarehouse } from "./inventory.model.js";
export interface IOrder extends Document {
  customer: ICustomer["_id"];
  items: {
    product: IProduct["_id"];
    quantity: number;
    price: number;
    discount: number;
    tax: number;
  }[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "partial";
  warehouse: IWarehouse["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
  },
  { timestamps: true },
);

export const Order = model<IOrder>("Order", orderSchema);
