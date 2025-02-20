import { Logger } from "winston";
import { ManagerService } from "../../../services/manager.service.js";
import { Request, Response, NextFunction, response } from "express";
import { AsssignedTask, IAsssignedTask } from "../../../models/employee.model.js";

interface NewTask {
    title: string
    description:string
    assignedEmployees:string[]
}

export class ManagerController {
    constructor(private logger:Logger, private managerService: ManagerService){}
    createNewtask = async (req:Request, res:Response, next:NextFunction): Promise<void> =>{
        try {
            const {title, description, assignedEmployees}   = req.body as NewTask
            this.logger.info(`Attempting to create new task`, { title });
            const result:IAsssignedTask = await this.managerService.createNewTask(title, description, assignedEmployees);
            this.logger.info(`Created new task`, { title });
            res.status(201).json({
                success: true,
                data: {
                    task:{
                        id: result._id,
                        title: result.title,
                        description: result.description,
                        assignedEmployees: result.assignedEmployees,
                        status: result.status
                    }
                }
            })
            return
        } catch (error) {
            next(error)
        }
    };
    getAllTasks = async (_req: Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            this.logger.info(`Attempting to get all tasks`);
            const result:IAsssignedTask[]  = await this.managerService.getAlltasks();
            this.logger.info(`Got all tasks`, { result });
            res.status(200).json({
                success: true,
                data: {
                    task: result
                }
            })
            return
        }
        catch (error) {
            next(error)
        }
    }
    getTask = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const {id} = req.body as {id:string}
            this.logger.info(`Attempting to get all task `, {id});
            const result: IAsssignedTask = await this.managerService.getTaskById(id);
            this.logger.info(`Got task`, {id})
            res.status(200).json({
                success:true,
                data:{
                    task:{
                        id: result._id,
                        title:result.title,
                        description: result.description,
                        assignedEmployees: result.assignedEmployees,
                        status: result.status
                    }
                }
            })
            return
        } catch (error) {
            next(error)
        }
    }
    assignUserToTask = async (req:Request, res:Response, next:NextFunction): Promise<void> =>{
        const {employeeId, taskId} = req.body as {employeeId:string, taskId: string}
        this.logger.info(`Attempting to assing `, {id});

    }

}