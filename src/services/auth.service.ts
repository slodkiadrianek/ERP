import { Logger } from "../utils/logger.js";
import { IEmployee } from "../models/employee.model.js";
import { Employee } from "../models/employee.model.js";
import { caching } from "../config/app.config.js";
import { AppError } from "../models/error.model.js";
import { newEmployee } from "../api/v1/controllers/auth.controller.js";
export class AuthService {
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }
  async registerEmployee(employeeData: newEmployee): Promise<IEmployee> {
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
      const result = await Employee.create(employeeData);
      // Properly save to cache
      await caching.set(`Employee-${result._id}`, JSON.stringify(result));
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error registering employee: ${errorMessage}`);
      throw new AppError(500, "Employee", "Failed to register employee");
    }
  }
}
