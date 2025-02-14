import express from "express";
import { AuthRoutes } from "./api/v1/routes/auth.routes.js";
export const app = express();

const userRoutes = new AuthRoutes();
app.use(userRoutes.router);
