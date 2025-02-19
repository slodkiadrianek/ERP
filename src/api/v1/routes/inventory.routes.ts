import { Authentication } from "../../../middleware/auth.middleware.js";
import { Logger } from "../../../utils/logger.js";

export class invetoryRoutes {
  private logger: Logger;
  private auth: Authentication;
  private invenController: inventoryController;
  constructor(
    logger: Logger,
    auth: Authentication,
    invenController: inventoryController,
  ) {
    this.logger = logger;
    this.auth = auth;
    this.invenController = invenController;
  }
}
