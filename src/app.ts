import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import * as yup from "yup";

import justify from "./justify";
import env from "./envalid";

const MAX_REQUESTS = 80_000;

const TokenSchema = yup.object({
    email: yup.string().email(),
});

const rateLimitStore = new Map<string, number>();
// reset the store every day
const rateLimitInterval = setInterval(
    () => rateLimitStore.clear(),
    1_000 * 60 * 60 * 24
);
rateLimitInterval.unref();

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());

/**
 * justify a text
 * @param  {string} the user token in the Bearer header
 * @param  {string} the text to justify in the request body
 * @returns the justified input in plain text
 */
app.post("/api/justify", (req, res) => {
    const token = req.header("bearer");

    if (!token) return res.sendStatus(401);

    jwt.verify(token, env.APP_SECRET, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.sendStatus(401);
        }

        // limit requests to 80_000 per day
        const previousRequests = rateLimitStore.get(decoded!.email) || 0;
        if (previousRequests > MAX_REQUESTS) return res.sendStatus(402);
        rateLimitStore.set(decoded!.email, previousRequests + 1);

        res.set(
            "X-RateLimit-Left",
            (MAX_REQUESTS - previousRequests - 1).toString()
        );

        if (!req.is("text/plain")) return res.sendStatus(400);
        const justified = justify(req.body);

        res.set("Content-Type", "text/plain");
        // Buffer.from prevents express from removing extra spaces
        return res.status(200).send(Buffer.from(justified));
    });
});

/**
 * create a jwt token from an email
 * @param  {{"email":"XXX"}} the user email in the request body
 * @returns the jwt token in the token field of the response body
 */
app.post("/api/token", async (req, res) => {
    if (await TokenSchema.isValid(req.body)) {
        const token = jwt.sign({ email: req.body.email }, env.APP_SECRET, {
            expiresIn: "2 days",
        });
        res.status(200).json({ token });
    } else {
        res.sendStatus(400);
    }
});

if (env.NODE_ENV === "development" || env.NODE_ENV === "production")
    app.listen(env.APP_PORT, () => {
        console.log(`app listening on port ${env.APP_PORT}`);
    });

export { rateLimitInterval, rateLimitStore };
export default app;
