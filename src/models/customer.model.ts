import { Document, Schema, model, Types } from "mongoose";
export interface ICustomer extends Document {
  _id: Types.ObjectId;
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

export const Customer = model<ICustomer>("Customer", customerSchema);
