import { Document, Schema, model, Model, Types } from "mongoose";
export interface IWarehouse extends Document {
  _id: Types.ObjectId;
  name: string;
  location: {
    country: string;
    city: string;
    street: string;
    code: string;
    number: number;
  };
  capacity: number; //  in m^3
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
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
    },
    capacity: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Warehouse: Model<IWarehouse> = model<IWarehouse>(
  "Warehouse",
  warehouseSchema,
);
