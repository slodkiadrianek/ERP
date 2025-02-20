import { Logger } from "../utils/logger.js";
import { IEmployee } from "../models/employee.model.js";
import { Employee } from "../models/employee.model.js";
import { AppError } from "../models/error.model.js";
import { newEmployee } from "../api/v1/controllers/auth.controller.js";
import { Authentication } from "../middleware/auth.middleware.js";
import bcrypt from "bcryptjs";
import { RedisCacheService } from "../types/common.types.js";

export class AuthService {
  private logger: Logger;
  private auth: Authentication;
  constructor(logger: Logger, auth: Authentication, private caching: RedisCacheService) {
    this.logger = logger;
    this.auth = auth;
  }
  registerEmployee = async (employeeData: newEmployee): Promise<IEmployee> => {
    try {
      const employeeExist = await Employee.findOne({
        email: employeeData.email,
      });
      if (employeeExist) {
        this.logger.error("Employee with this email already exists");
        throw new AppError(
          409,
          "Employee",
          "Employee with this email already exists",
        );
      }
      const hashedPassword = await bcrypt.hash(employeeData.password, 12);
      employeeData.password = hashedPassword;
      const result = await Employee.create(employeeData);
     await  this.caching.set(`Employee-${result.email}`, JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error(`Error registering employee: ${error}`);
      throw new AppError(500, "Employee", "Failed to register employee");
    }
  };
  loginEmployee = async (
    email: string,
    password: string,
  ): Promise<{ employee: IEmployee; token: string }> => {
    try {
      const employeeExist: IEmployee | null = await Employee.findOne({
        email,
      });
      if (!employeeExist) {
        throw new AppError(
          404,
          "Employee",
          "Employee with this email does not exist",
        );
      }
      const passwordComparison = await bcrypt.compare(
        password,
        employeeExist.password,
      );
      if (!passwordComparison) {
        throw new AppError(401, "Employee", "Password is incorrect");
      }
      const token = this.auth.sign(employeeExist);
      return { employee: employeeExist, token };
    } catch (error) {
      if (error instanceof AppError) throw error;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error during logging employee: ${errorMessage}`);
      throw new AppError(500, "Employee", "Failed to login employee");
    }
  };
}
