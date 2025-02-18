import { Document, Schema, model, Types } from "mongoose";

export interface IWarehouse extends Document {
  _id: Types.ObjectId;
  name: string;
  location: {
    country: string;
    city: string;
    street: string;
    code: number;
    number: string;
  };
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

const warehouseSchema = new Schema<IWarehouse>(
  {
    name: { type: String, required: true },
    location: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      code: {
        type: Number,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    capacity: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Warehouse = model("Warehouse", warehouseSchema);
