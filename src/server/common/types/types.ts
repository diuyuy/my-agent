import { Session, User } from "better-auth";

export type Env = {
  Variables: {
    user: User;
    session: Session;
  };
};
