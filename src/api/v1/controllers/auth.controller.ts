import { NextFunction, Response, Request } from "express";
import { AuthService } from "../../../services/auth.service.js";
import { Logger } from "../../../utils/logger.js";
import { IEmployee } from "../../../models/employee.model.js";
import { Types } from "mongoose";
export interface newEmployee {
  firstname: string;
  lastname: string;
  email: string;
  role: Types.ObjectId;
  password: string;
  isActive: boolean;
}

export class AuthController {
  private logger: Logger;
  private authService: AuthService;
  constructor(logger: Logger, authService: AuthService) {
    this.logger = logger;
    this.authService = authService;
  }
  registerEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { firstname, lastname, email, role, password } =
        req.body as newEmployee;
      this.logger.info(`Attempting to register new employee`, { email });
      const isActive: boolean = true;
      const result: IEmployee = await this.authService.registerEmployee({
        firstname,
        lastname,
        email,
        role,
        password,
        isActive,
      });
      this.logger.info(`Employee succesfully created`, {
        employeeId: result._id,
      });
      res.status(201).json({
        success: true,
        data: {
          employee: {
            id: result._id,
            email: result.email,
            firstname: result.firstname,
            lastname: result.lastname,
          },
        },
      });
      return;
    } catch (err) {
      next(err);
    }
  };
  loginEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      this.logger.info("Attempting to login employee", { email });
      const result: { employee: IEmployee; token: string } =
        await this.authService.loginEmployee(email, password);
      this.logger.info(" Employee succesfully logged", {
        employeeId: result.employee._id,
      });
      res.status(200).json({
        success: true,
        data: {
          employee: {
            id: result.employee._id,
            email: result.employee.email,
            firstname: result.employee.firstname,
            lastname: result.employee.lastname,
          },
          token: result.token,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
