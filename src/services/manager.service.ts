import { AsssignedTask, IAsssignedTask } from "../models/employee.model.js";
import mongoose from "mongoose";
import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { AppError } from "../models/error.model.js";

export class ManagerService {
  constructor(
    private logger: Logger,
    private caching: RedisCacheService,
  ) {}
  createNewTask = async (
    title: string,
    description: string,
    employeesID: string[],
  ): Promise<IAsssignedTask> => {
    try {
      const newtask: IAsssignedTask = await AsssignedTask.create({
        title,
        description,
        assignedEmployees: employeesID,
      });
      await this.caching.set(
        `Task-${newtask._id}`,
        JSON.stringify(newtask),
        300,
      );
      return newtask;
    } catch (error) {
      this.logger.error("Failed to register new task", { error });
      throw new AppError(500, "Task", "Failed to register new task");
    }
  };
  getAlltasks = async (): Promise<IAsssignedTask[]> => {
    if (await this.caching.exists(`All-Tasks`)) {
      const result: IAsssignedTask[] | null = JSON.parse(
        (await this.caching.get(`All-Tasks`)) || "",
      );
      if (!result) {
        this.logger.error(
          `An error occurred while retrieving tasks from the cache.`,
        );
        throw new AppError(
          404,
          "TASK",
          "An error occurred while retrieving tasks from the cache.",
        );
      }
      return result;
    }
    const tasks: IAsssignedTask[] = await AsssignedTask.find();
    return tasks;
  };
  getTaskById = async (id: string): Promise<IAsssignedTask> => {
    if (await this.caching.exists(`Task-${id}`)) {
      const result: IAsssignedTask | null = JSON.parse(
        (await this.caching.get(`Task-${id}`)) || "",
      );
      if (!result) {
        this.logger.error(
          `An error occurred while retrieving task from the cache.`,
          { id },
        );
        throw new AppError(
          404,
          "TASK",
          "An error occurred while retrieving task  from the cache.",
        );
      }
      return result;
    }
    const task: IAsssignedTask | null = await AsssignedTask.findOne({
      _id: id,
    });
    if (!task) {
      throw new AppError(404, "Task", "Task with this ID does not exist");
    }
    return task;
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
      { new: true },
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
    result.status = "done";
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
        "Problem occurred during assigning new employees to task",
        { taskId },
      );
      throw new AppError(
        404,
        "Task",
        "Problem occurred during assigning new employees to task",
      );
    }
    await this.caching.set(`Task-${taskId}`, JSON.stringify(result));
    return result;
  };
}
