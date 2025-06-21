import express from "express";
import { middlewareGetMetrics, middlewareLogResponses, middlewareMetricsInc, middlewareResetMetrics } from "./middleware.js";
import { handlerReadiness } from "./api/readiness.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/healthz", handlerReadiness);
app.get("/metrics", middlewareGetMetrics, handlerReadiness);
app.get("/reset", middlewareResetMetrics, handlerReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
