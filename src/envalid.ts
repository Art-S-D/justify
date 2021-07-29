import { cleanEnv, num, str } from "envalid";

export default cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ["development", "production", "test"],
    }),

    APP_PORT: num({
        default: 8000,
    }),
    APP_SECRET: str({
        devDefault: "dev-secret",
    }),
});
