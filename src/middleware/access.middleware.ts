import { AuthenticatedRequest } from "../types/module.types.js";
import { AppError } from "../models/error.model.js";
import { Request, Response, NextFunction } from "express";
export const taskPermissions: string[] = [
  "67b617946cd87f74fd8b64da",
  "67bc1523f94794bc4ad23533",
  "67b6177c6cd87f74fd8b64d9",
];
export const productPermissions: string[] = [
  "67b617946cd87f74fd8b64da",
  "67b616f56cd87f74fd8b64d5",
];

export const buyAndSalePermissions: string[] = [
  "67b6177c6cd87f74fd8b64d9",
  "67bc1548f94794bc4ad23534",
];

export const paymentPermissions: string[] = [
  "67b616e86cd87f74fd8b64d4",
  "67bc1523f94794bc4ad23533",
];

export const reportPermissions: string[] = [
  "67bc1523f94794bc4ad23533",
  "67b617946cd87f74fd8b64da",
  "67b6177c6cd87f74fd8b64d9",
];

export const warehousesPermissions: string[] = ["67b617946cd87f74fd8b64da"];
export const productsPermissions: string[] = [
  "67b616f56cd87f74fd8b64d5",
  "67b617946cd87f74fd8b64da",
];
export const purchasePermissions: string[] = [
  "67b6177c6cd87f74fd8b64d9",
  "67bc1548f94794bc4ad23534",
];

export function permissionsCheck(permissionsSchema: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!(req as AuthenticatedRequest).employee.role) {
      throw new AppError(400, "Authentication", "Role must be defined");
    }
    if (
      !permissionsSchema.includes(
        (req as AuthenticatedRequest).employee.role || "",
      )
    ) {
      throw new AppError(
        403,
        "Authentication",
        "You are not allowed to do this action",
      );
    }
    next();
  };
}
