import express from "express";
import { middlewareErrorHandler, middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidate } from "./api/validate.js";


const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));


app.get("/api/healthz", (req, res, next) => {
  	Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.post("/api/validate_chirp", (req, res, next) => {
  	Promise.resolve(handlerValidate(req, res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
  	Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  	Promise.resolve(handlerReset(req, res)).catch(next);
});


app.use(middlewareLogResponse, middlewareErrorHandler);
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});