import { Router } from "express";
import { Authentication } from "../../../middleware/auth.middleware.js";
import { ManagerController } from "../controllers/manager.controller.js";
import { ValidationMiddleware } from "../../../middleware/validation.middleware.js";
import {
  addEmployeestoTask,
  createNewTask,
  taskId,
} from "../../../schemas/manager.schema.js";
import {
  permissionsCheck,
  taskPermissions,
} from "../../../middleware/access.middleware.js";
export class ManagerRoutes {
  constructor(
    private auth: Authentication,
    private managerController: ManagerController,
    public router: Router = Router(),
  ) {
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.post(
      "/api/v1/managers/tasks",
      this.auth.verify,
      permissionsCheck(taskPermissions),
      ValidationMiddleware.validate(createNewTask, "body"),
      this.managerController.createNewtask,
    );
    this.router.get(
      "/api/v1/managers/tasks",
      this.auth.verify,
      this.managerController.getAllTasks,
    );
    this.router.get(
      "/api/v1/managers/tasks/:id",
      this.auth.verify,
      ValidationMiddleware.validate(taskId, "params"),
      this.managerController.getTask,
    );
    this.router.patch(
      "/api/v1/managers/tasks/:id/employees",
      this.auth.verify,
      permissionsCheck(taskPermissions),
      ValidationMiddleware.validate(taskId, "params"),
      ValidationMiddleware.validate(addEmployeestoTask),
      this.managerController.assignEmployeesToTask,
    );
    this.router.patch(
      "/api/v1/managers/tasks/:id/status",
      this.auth.verify,
      permissionsCheck(taskPermissions),
      ValidationMiddleware.validate(taskId, "params"),
      this.managerController.updateStatus,
    );
    this.router.get(
      "/api/v1/managers/tasks/employees/:id",
      this.auth.verify,
      ValidationMiddleware.validate(taskId, "params"),
      this.managerController.getEmployeesTasks,
    );
    this.router.put(
      "/api/v1/managers/tasks/:id",
      this.auth.verify,
      permissionsCheck(taskPermissions),
      ValidationMiddleware.validate(taskId, "params"),
      ValidationMiddleware.validate(createNewTask, "body"),
      this.managerController.updateTask,
    );
    this.router.delete(
      "/api/v1/managers/tasks/:id",
      this.auth.verify,
      permissionsCheck(taskPermissions),
      ValidationMiddleware.validate(taskId, "params"),
      this.managerController.deleteTask,
    );
  }
}
