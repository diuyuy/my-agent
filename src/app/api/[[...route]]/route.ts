import { auth } from "@/lib/auth";
import { globalExceptionHandler } from "@/server/common/errors/global-exception-handler";
import { sessionMiddleware } from "@/server/common/middlewares/session.middleware";
import { Env } from "@/server/common/types/types";
import { zodValidationHook } from "@/server/common/utils/zod-validation-hook";
import conversationRoute from "@/server/features/conversations/conversation.route";
import messageRoute from "@/server/features/messages/message.route";
import ragRoute from "@/server/features/rags/rag.route";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { handle } from "hono/vercel";

const app = new OpenAPIHono<Env>({
  defaultHook: zodValidationHook,
}).basePath("/api");

app.onError(globalExceptionHandler);

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.use(sessionMiddleware);
app.route("/conversations", conversationRoute);
app.route("/messages", messageRoute);
app.route("/rags", ragRoute);

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
