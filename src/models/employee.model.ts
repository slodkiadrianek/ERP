import { Document, Schema, model, Types } from "mongoose";

export interface IRole extends Document {
  _id: Types.ObjectId;
  name: string;
}

export interface IEmployee extends Document {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  role: IRole["_id"];
  isActive: boolean;
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
});

const employeeSchema = new Schema<IEmployee>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export interface IAsssignedTask {
  _id: string;
  title: string;
  description: string;
  assignedEmployees: string[];
  status: "done" | "undone";
}

const assignedTaskSchema = new Schema<IAsssignedTask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedEmployees: { type: [Types.ObjectId], required: true },
  status: { type: String, enum: ["done", "undone"], default: "undone" },
});

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
  { timestamps: true },
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
  { timestamps: true },
);

export const Role = model("Role", roleSchema);
export const Employee = model("Employee", employeeSchema);
export const Attendance = model("Attendance", attendanceSchema);
export const Payroll = model("Payroll", payrollSchema);
export const AsssignedTask = model("AssignedTask", assignedTaskSchema);
