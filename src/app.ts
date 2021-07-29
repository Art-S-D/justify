import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import * as yup from "yup";

import justify from "./justify";
import env from "./envalid";

const TokenSchema = yup.object({
    email: yup.string().email(),
});

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());

app.post(
    "/api/justify",
    //TODO limite rate
    (req, res) => {
        const token = req.header("bearer");

        if (!token) return res.sendStatus(401);

        jwt.verify(token, env.APP_SECRET, (err /* , decoded */) => {
            if (err) {
                console.error(err);
                return res.sendStatus(401);
            }

            if (!req.is("text/plain")) return res.sendStatus(400);
            const justified = justify(req.body);

            // Buffer.from prevents express from removing extra spaces
            return res.status(200).send(Buffer.from(justified));
        });
    }
);

app.post("/api/token", async (req, res) => {
    if (await TokenSchema.isValid(req.body)) {
        const token = jwt.sign({ email: req.body.email }, env.APP_SECRET, {
            expiresIn: "7 days",
        });
        res.status(200).json({ token });
    } else {
        res.sendStatus(400);
    }
});

app.listen(env.APP_PORT, () => {
    console.log(`app listening on port ${env.APP_PORT}`);
});
