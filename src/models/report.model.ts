import { Document, Schema, model, Types } from "mongoose";
import { IWarehouse } from "./inventory.model.js";
import { IEmployee } from "./employee.model.js";

export interface IReport extends Document {
  _id: Types.ObjectId;
  title: string;
  type: IWarehouse["_id"];
  generatedBy: IEmployee["_id"];
  filters: {
    startDate: Date;
    endDate: Date;
  };
  generatedAt: Date;
  exportFormat: "pdf" | "csv";
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    title: { type: String, required: true },
    type: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    generatedAt: { type: Date, default: Date.now },
    filters: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
    exportFormat: {
      type: String,
      enum: ["pdf", "csv"],
      default: "pdf",
    },
    filePath: { type: String },
  },
  { timestamps: true },
);

export const Report = model("Report", reportSchema);
