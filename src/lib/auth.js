
import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import { client, db } from "@/lib/mongodb";

const productionURL = process.env.BETTER_AUTH_URL;

if (!productionURL) {
  throw new Error("BETTER_AUTH_URL is missing.");
}

const productionHost = new URL(productionURL).host;

// Permit only the canonical RoadNest domain and its own
// Vercel-generated deployment domains.
const authBaseURL =
  process.env.VERCEL === "1"
    ? {
        allowedHosts: [
          productionHost,
          "roadnest-app-*.vercel.app",
        ],
        protocol: "https",
        fallback: productionURL,
      }
    : productionURL;

export const auth = betterAuth({
  baseURL: authBaseURL,

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      isDriver: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },

  plugins: [
    jwt({
      sessionCookieCache: true,
    }),
  ],
});
