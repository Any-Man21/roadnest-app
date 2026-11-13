import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// import { auth } from "@/lib/auth"; // path to your auth file
// import { toNextJsHandler } from "better-auth/next-js";

// export const { POST, GET } = toNextJsHandler(auth);


import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";
import { connectMongo } from "@/lib/mongodb";



const handlers = toNextJsHandler(auth);

async function runAuthHandler(handler, request) {
  try {
    await connectMongo();
  } catch (error) {
    console.error("Better Auth MongoDB connection failed:", error);

    return Response.json(
      { message: "Authentication service temporarily unavailable." },
      { status: 503 }
    );
  }

  return handler(request);
}

export const GET = (request) =>
  runAuthHandler(handlers.GET, request);

export const POST = (request) =>
  runAuthHandler(handlers.POST, request);
