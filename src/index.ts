import { config } from "./config.js";
import express, { Application, NextFunction } from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { middlewareErrorHandler, middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidate } from "./api/validate.js";
import { handleLogin, handlerUpdateUser, handleUsers } from "./api/users.js";
import { handleGetChirp, handleGetChirps, handlerDeleteChirp, handleUserChirps } from "./api/chirps.js";
import { handlerRefresh, handlerRevoke } from "./api/auth.js";
import { handlerPolkaHooks } from "./api/polka.js";


const app = express();

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// Middleware to parse JSON bodies
app.use(express.json());

function wrapAsync(asyncFn: (...args: any[]) => Promise<any> | any): any {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(asyncFn(req, res, next)).catch(next);
	}
}

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", wrapAsync(handlerReadiness));

// app.get("/api/healthz", (req, res, next) => {
//   	Promise.resolve(handlerReadiness(req, res)).catch(next);
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
app.get("/api/chirps", (req, res, next) => {
  	Promise.resolve(handleGetChirps(req, res)).catch(next);
});

app.post("/api/login", (req, res, next) => {
  	Promise.resolve(handleLogin(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevoke(req, res)).catch(next);
});

app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUpdateUser(req, res)).catch(next);
});

app.get("/api/chirps/:chirpID", (req, res, next) => {
  	Promise.resolve(handleGetChirp(req, res)).catch(next);
});
app.delete("/api/chirps/:chirpId", (req, res, next) => {
	Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
})

app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(handlerPolkaHooks(req, res)).catch(next);
});

app.use(middlewareLogResponse, middlewareErrorHandler);
app.listen(config.api.port, () => {
	console.log(`Server is running at http://localhost:${config.api.port}`);
});