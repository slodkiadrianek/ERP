import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./inventory.model.js";

export interface ICustomer extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: {
    country: string;
    city: string;
    street: string;
    code: number;
    number: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

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
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      code: { type: Number, required: true },
      number: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
const Order = mongoose.model<IOrder>("Order", orderSchema);

export { Customer, Order };
