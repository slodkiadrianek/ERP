import { Document, Schema, model, Types } from "mongoose";
import { IOrder } from "./sale.model.js";
export interface IInvoice extends Document {
  _id: Types.ObjectId;
  order: IOrder["_id"];
  amount: number;
  status: "paid" | "unpaid";
  createdAt: Date;
  updatedAt: Date;
}
export interface ITransaction extends Document {
  _id: Types.ObjectId;
  type: "income" | "expense";
  amount: number;
  description: string;
  referenceId: IInvoice["_id"];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  },
  { timestamps: true }
);

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    referenceId: { type: Schema.Types.ObjectId },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Invoice = model("Invoice", invoiceSchema);
export const Transaction = model("Transaction", transactionSchema);
