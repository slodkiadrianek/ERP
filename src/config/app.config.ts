import express from "express";
import { app } from "../app.js";
import cors from "cors";
import helmet from "helmet";

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
