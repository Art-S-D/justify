import express from "express";

const app = express();

app.post("/api/justify", (req, res) => {
    // TODO
    res.sendStatus(501);
});

app.get("/api/token", (req, res) => {
    res.sendStatus(501);
});

app.listen(8000);
console.log("app listening on port 8000");
