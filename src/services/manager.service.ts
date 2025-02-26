import { AsssignedTask, IAsssignedTask } from "../models/employee.model.js";
import mongoose from "mongoose";
import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { AppError } from "../models/error.model.js";
import { BaseService } from "./base.service.js";

export class ManagerService extends BaseService {
  constructor(logger: Logger, caching: RedisCacheService) {
    super(logger, caching);
  }
  createNewTask = async (
    data: Omit<IAsssignedTask, "_id">,
  ): Promise<IAsssignedTask> => {
    return this.insertToDatabaseAndCache<IAsssignedTask>(
      "Task",
      data,
      AsssignedTask,
    );
  };
  getAlltasks = async (): Promise<IAsssignedTask[]> => {
    return this.getAllItems<IAsssignedTask>("Tasks", AsssignedTask);
  };
  getTaskById = async (id: string): Promise<IAsssignedTask> => {
    return this.getItemById<IAsssignedTask>("Task", id, AsssignedTask);
  };
  assignEmployeesToTask = async (
    employees: string[],
    taskId: string,
  ): Promise<IAsssignedTask> => {
    const result: IAsssignedTask | null = await AsssignedTask.findOneAndUpdate(
      { _id: taskId },
      {
        $addToSet: {
          assignedEmployees: {
            $each: employees.map((el) => new mongoose.Types.ObjectId(el)),
          },
        },
      },
    );
    if (!result) {
      this.logger.error(
        "Problem occurred during assigning new employees to task",
        { taskId },
      );
      throw new AppError(
        404,
        "Task",
        "Problem occurred during assigning new employees to task",
      );
    }
    result.assignedEmployees.push(...employees);
    await this.caching.set(`Task-${taskId}`, JSON.stringify(result));
    return result;
  };
  updateStatus = async (taskId: string): Promise<IAsssignedTask> => {
    const result: IAsssignedTask | null = await AsssignedTask.findOneAndUpdate(
      {
        _id: taskId,
      },
      {
        status: "done",
      },
    );
    if (!result) {
      this.logger.error(
        "Problem occurred during updating status of the  task",
        { taskId },
      );
      throw new AppError(
        404,
        "Task",
        "Problem occurred during updating of the task",
      );
    }
    result.status = "done";
    await this.caching.set(`Task-${taskId}`, JSON.stringify(result));
    return result;
  };
  getEmployeeTasks = async (employeeId: string): Promise<IAsssignedTask[]> => {
    const result: IAsssignedTask[] | null = await AsssignedTask.find({
      assignedEmployees: employeeId,
    });
    if (!result) {
      this.logger.error(
        "Problem occurred during updating status of the  task",
        { employeeId },
      );
      throw new AppError(
        404,
        "Task",
        "Problem occurred during updating of the task",
      );
    }
    return result;
  };
  updateTask = async (
    taskId: string,
    data: Omit<IAsssignedTask, "_id">,
  ): Promise<IAsssignedTask> => {
    return this.updateItem<IAsssignedTask>("Task", taskId, data, AsssignedTask);
  };
  deleteTask = async (taskId: string): Promise<string> => {
    return this.deleteItem<IAsssignedTask>("Task", taskId, AsssignedTask);
  };
}
