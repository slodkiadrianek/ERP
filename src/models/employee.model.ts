import { Document, Schema, model, Types } from "mongoose";

export interface IRole extends Document {
  _id: Types.ObjectId;
  name: string;
  permissions: { [key: string]: string }[];
}

export interface IEmployee extends Document {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  role: IRole["_id"];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendance extends Document {
  employee: IEmployee["_id"];
  from: Date;
  to: Date;
  leaveType: string;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }],
});

const employeeSchema = new Schema<IEmployee>(
  {
    firstname: { type: String, required: true, unique: true },
    lastname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    leaveType: { type: String, required: true },
  },
  { timestamps: true }
);

const payrollSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    payrollPeriod: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  },
  { timestamps: true }
);

export const Role = model("Role", roleSchema);
export const User = model("User", employeeSchema);
export const Attendance = model("Attendance", attendanceSchema);
export const Payroll = model("Payroll", payrollSchema);
