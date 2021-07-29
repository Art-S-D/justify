import express from "express";
import bodyParser from "body-parser";

import justify from "./justify";
import env from "./envalid";

const app = express();
app.use(bodyParser.text());

app.post(
    "/api/justify",
    //TODO limite rate
    //TODO check token
    (req, res) => {
        if (!req.is("text/plain")) return res.sendStatus(400);
        const justified = justify(req.body);

        // Buffer.from prevents express from removing extra spaces
        res.status(200).send(Buffer.from(justified));
    }
);

app.get("/api/token", (req, res) => {
    res.sendStatus(501);
});

app.listen(env.APP_PORT, () => {
    console.log(`app listening on port ${env.APP_PORT}`);
});
