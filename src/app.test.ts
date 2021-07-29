import request from "supertest";
import jwt from "jsonwebtoken";

import env from "./envalid";
import justify from "./justify";
import app, { rateLimitStore } from "./app";

describe("POST: /api/token", () => {
    it("should fail with code 400 if the body is invalid", (done) => {
        request(app)
            .post("/api/token")
            .send({ email: "not an email" })
            .expect(400, done);
    });
    it("should send a valid token", (done) => {
        request(app)
            .post("/api/token")
            .send({ email: "test@tester.com" })
            .expect(200)
            .then((res) => {
                jwt.verify(
                    res.body?.token,
                    env.APP_SECRET,
                    (err: jwt.VerifyErrors | null) => {
                        if (err) done(err);
                        else done();
                    }
                );
            });
    });
});

describe("POST: /api/justify", () => {
    it("should expect a token", (done) => {
        request(app).post("/api/justify").expect(401, done);
    });
    it("should expect a valid token", (done) => {
        request(app)
            .post("/api/justify")
            .send("invalid token")
            .expect(401, done);
    });
    it("should send back justified text", (done) => {
        const input =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eget lacus et velit pretium scelerisque. Proin justo metus";
        request(app)
            .post("/api/justify")
            .set(
                "Bearer",
                jwt.sign({ email: "test@tester.com" }, env.APP_SECRET)
            )
            .set("Content-Type", "text/plain")
            .send(input)
            .expect(200)
            .then((res) => {
                expect(res.text).toBe(justify(input));
                done();
            })
            .catch(done);
    });
    it("should limit the rate", (done) => {
        request(app)
            .post("/api/justify")
            .set(
                "Bearer",
                jwt.sign({ email: "test@tester.com" }, env.APP_SECRET)
            )
            .set("Content-Type", "text/plain")
            .send("some text")
            .expect(200)
            .then((res) => {
                expect(res.headers["x-ratelimit-left"]).toBe(
                    (80_000 - rateLimitStore.get("test@tester.com")!).toString()
                );

                rateLimitStore.set("test@tester.com", 100_000);

                request(app)
                    .post("/api/justify")
                    .set(
                        "Bearer",
                        jwt.sign({ email: "test@tester.com" }, env.APP_SECRET)
                    )
                    .set("Content-Type", "text/plain")
                    .send("some text")
                    .expect(402, done);
            })
            .catch(done);
    });
});
