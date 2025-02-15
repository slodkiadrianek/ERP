import express from "express";
import { app } from "../app.js";
import cors from "cors";
import helmet from "helmet";
import { createClient } from "redis";
export let caching: ReturnType<typeof createClient>;
if (process.env.CACHE_LINK) {
  caching = await createClient({
    url: process.env.CACHE_LINK,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
} else {
  console.error(`No cache link provided`);
  process.exit(1);
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
