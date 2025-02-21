import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  employee: {
    id?: string;
    role?: string;
    email: string;
    iat?: number;
  };
}
