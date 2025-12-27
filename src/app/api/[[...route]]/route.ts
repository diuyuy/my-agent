import { RESPONSE_STATUS } from "@/constants/response-status";
import { auth } from "@/lib/auth";
import { CommonHttpException } from "@/server/common/errors/common-http-exception";
import { globalExceptionHandler } from "@/server/common/errors/global-exception-handler";
import { Env } from "@/server/common/types/types";
import conversationRoute from "@/server/features/conversations/conversation.route";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { handle } from "hono/vercel";

const app = new OpenAPIHono<Env>().basePath("/api");

app.onError(globalExceptionHandler);

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/conversations", conversationRoute);

app.get("/hello", async () => {
  throw new CommonHttpException(RESPONSE_STATUS.NOT_FOUND);
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My-Agent API",
  },
});

app.get("/scalar", Scalar({ url: "/api/doc" }));

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
