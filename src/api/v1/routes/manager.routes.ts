import { Router } from "express";
import { Authentication } from "../../../middleware/auth.middleware.js";
import { ManagerController } from "../controllers/manager.controller.js";
import { ValidationMiddleware } from "../../../middleware/validation.middleware.js";
import { createNewTask } from "../../../schemas/manager.schema.js";

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
      "/api/v1/managers/task",
      this.auth.verify,
      ValidationMiddleware.validate(createNewTask, "body"),
      this.managerController.createNewtask,
    );
    this.router.get(
      "/api/v1/managers/task",
      this.auth.verify,
      this.managerController.getAllTasks,
    );
  }
}

