import { Logger } from "winston";
import { ManagerService } from "../../../services/manager.service.js";
import { Request, Response, NextFunction } from "express";
import { IAsssignedTask } from "../../../models/employee.model.js";
import { AppError } from "../../../models/error.model.js";
import { AuthenticatedRequest } from "../../../types/module.types.js";

interface NewTask {
  title: string;
  description: string;
  assignedEmployees: string[];
}

export class ManagerController {
  constructor(
    private logger: Logger,
    private managerService: ManagerService,
  ) {}
  // Route for creating tasks
  createNewtask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!(req as AuthenticatedRequest).employee.role) {
        throw new AppError(404, "Authentication", "Role must be defined");
      }
      if (
        (req as AuthenticatedRequest).employee.role !==
        "67b6176b6cd87f74fd8b64d8"
      ) {
        throw new AppError(
          403,
          "Authentication",
          "You are not allowed to create new task",
        );
      }
      const { title, description, assignedEmployees } = req.body as NewTask;
      this.logger.info(`Attempting to create new task`, { title });
      const result: IAsssignedTask = await this.managerService.createNewTask(
        title,
        description,
        assignedEmployees,
      );
      this.logger.info(`Created new task`, { title });
      res.status(201).json({
        success: true,
        data: {
          task: {
            id: result._id,
            title: result.title,
            description: result.description,
            assignedEmployees: result.assignedEmployees,
            status: result.status,
          },
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  // Route for getting all tasks
  getAllTasks = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      this.logger.info(`Attempting to get all tasks`);
      const result: IAsssignedTask[] = await this.managerService.getAlltasks();
      this.logger.info(`Got all tasks`, { result });
      res.status(200).json({
        success: true,
        data: {
          task: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  //Get task by id
  getTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.params.id) {
        throw new AppError(400, "Task", "You have to specifie ID of a task");
      }
      if (typeof req.params.id !== "string") {
        throw new AppError(404, "Task", "ID must be type of string");
      }
      const { id } = req.params as { id: string };
      this.logger.info(`Attempting to get  task `, { id });
      const result: IAsssignedTask = await this.managerService.getTaskById(id);
      this.logger.info(`Got task`, { id });
      res.status(200).json({
        success: true,
        data: {
          task: {
            id: result._id,
            title: result.title,
            description: result.description,
            assignedEmployees: result.assignedEmployees,
            status: result.status,
          },
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  //Route for adding new employees to certain task
  assignEmployeesToTask = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!(req as AuthenticatedRequest).employee.role) {
        throw new AppError(400, "Authentication", "Role must be defined");
      }
      if (
        (req as AuthenticatedRequest).employee.role !==
        "67b6176b6cd87f74fd8b64d8"
      ) {
        throw new AppError(
          403,
          "Authentication",
          "You are not allowed to create new task",
        );
      }
      if (!req.params.id) {
        throw new AppError(404, "Task", "You have to specifie ID of a task");
      }
      if (typeof req.params.id !== "string") {
        throw new AppError(404, "Task", "ID must be type of string");
      }
      const taskId = req.params.id as string;
      const employees = req.body.assignedEmployees as string[];
      this.logger.info(`Attempting to assign new employees to task`, {
        employees,
        taskId,
      });
      const result = await this.managerService.assignEmployeesToTask(
        employees,
        taskId,
      );
      this.logger.info(`Employees added to task`, { result });
      res.status(200).json({
        success: true,
        data: {
          task: {
            _id: result._id,
            title: result.title,
            description: result.description,
            assignedEmployees: result.assignedEmployees,
            status: result.status,
          },
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      console.log((req as AuthenticatedRequest).employee.role);

      if (!(req as AuthenticatedRequest).employee.role) {
        throw new AppError(400, "Authentication", "Role must be defined");
      }
      if (
        (req as AuthenticatedRequest).employee.role !==
        "67b6176b6cd87f74fd8b64d8"
      ) {
        throw new AppError(
          403,
          "Authentication",
          "You are not allowed to create new task",
        );
      }
      if (!req.params.id) {
        throw new AppError(404, "Task", "You have to specifie ID of a task");
      }
      if (typeof req.params.id !== "string") {
        throw new AppError(404, "Task", "ID must be type of string");
      }
      const taskId = req.params.id as string;
      this.logger.info(`Attempting to update status of  task `, { taskId });
      const result: IAsssignedTask =
        await this.managerService.updateStatus(taskId);
      this.logger.info(`Status updated successfully`, { taskId });
      res.status(200).json({
        success: true,
        data: {
          task: {
            _id: result._id,
            title: result.title,
            description: result.description,
            assignedEmployees: result.assignedEmployees,
            status: result.status,
          },
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
}
