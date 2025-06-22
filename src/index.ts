import express from "express";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));


app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
// app.get('/admin/reset', (req, res) => {
//     res.status(404).send('Page not found.');
// });

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});