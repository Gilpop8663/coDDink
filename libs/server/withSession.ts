import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const sessionOption = {
  cookieName: "1000_idea",
  password: process.env.COOKIE_PASSWORD!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, sessionOption);
}
