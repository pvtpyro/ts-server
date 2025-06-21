import express from "express";
const app = express();
const PORT = 8080;
app.use("/app", express.static("./src/app"));
// healthz
function handlerReadiness(req, res) {
    res.type("text/plain; charset=utf-8");
    res.status(200);
    res.send("OK");
}
;
app.get("/healthz", handlerReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
