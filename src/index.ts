import { config } from "./config.js";
import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { middlewareErrorHandler, middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidate } from "./api/validate.js";
import { handleUserChirps, handleUsers } from "./api/users.js";


const app = express();

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));


app.get("/api/healthz", (req, res, next) => {
  	Promise.resolve(handlerReadiness(req, res)).catch(next);
});

// app.post("/api/validate_chirp", (req, res, next) => {
//   	Promise.resolve(handlerValidate(req, res)).catch(next);
// });

app.get("/admin/metrics", (req, res, next) => {
  	Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  	Promise.resolve(handlerReset(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  	Promise.resolve(handleUsers(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
  	Promise.resolve(handleUserChirps(req, res)).catch(next);
});


app.use(middlewareLogResponse, middlewareErrorHandler);
app.listen(config.api.port, () => {
	console.log(`Server is running at http://localhost:${config.api.port}`);
});