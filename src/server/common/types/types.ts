import * as authSchema from "@/db/schema/auth-schema";
import { Session, User } from "better-auth";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export type Env = {
  Variables: {
    user: User;
    session: Session;
  };
};

export type DBType = NodePgDatabase<typeof authSchema>;
