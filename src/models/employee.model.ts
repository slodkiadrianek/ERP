import mongoose from "mongoose";

export interface IRole {
  _id: string;
  name: string;
  permissions: { [key: string]: string }[];
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  email: string;
  role: IRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new mongoose.Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }],
});

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
export const User = mongoose.model("User", userSchema);
