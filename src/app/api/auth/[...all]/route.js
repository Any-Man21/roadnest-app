import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);