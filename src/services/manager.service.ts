import { AsssignedTask, IAsssignedTask } from "../models/employee.model.js";
import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { AppError } from "../models/error.model.js";

export class ManagerService {
  constructor(private logger: Logger, private caching : RedisCacheService) {}
  createNewTask = async(title: string,  description: string, employeesID: string[]): Promise<IAsssignedTask> =>{
    try {
        const newtask :IAsssignedTask = await AsssignedTask.create({
            title, 
            description, 
            assignedEmployees: employeesID
          })
          await this.caching.set(`Task${newtask._id}`, JSON.stringify(newtask));
          return newtask;
    } catch (error) {
        this.logger.error("Failed to register new task", {error})
        throw new AppError(500, "Task", "Failed to register new task");
    }
  }
  getAlltasks = async():Promise<IAsssignedTask[]> =>{
    const tasks:IAsssignedTask[] = await AsssignedTask.find()
    return tasks 
  }
  getTaskById = async (id:string):Promise<IAsssignedTask> =>{
    const task:IAsssignedTask | null = await AsssignedTask.findOne({
        _id:id
    })
    if(!task){
        throw new AppError(404, 'Task', 'Task with this ID does not exist')
    }
    return task
  }
}
