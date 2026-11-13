import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { betterAuth } from "better-auth";

import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_URI
);
const db = client.db("roadnest");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
  }),
   user: {
    additionalFields: {
      isDriver: { type: "boolean", defaultValue: false },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:{
    google:{
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },
  session:{
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      // max 7 days
      maxAge: 7 * 24 * 60 * 60
    }
  },
  plugins: [
    jwt({
      sessionCookieCache: true
    })
  ]
});