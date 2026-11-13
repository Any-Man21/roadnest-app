
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is missing from environment variables.");
}

const globalForMongo = globalThis;

// Reuse the same MongoClient across requests and development reloads.
const client =
  globalForMongo.roadnestMongoClient ||
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 10000,
  });

globalForMongo.roadnestMongoClient = client;

// Share one connection promise so concurrent requests don't
// independently initialize the same MongoClient.
export function connectMongo() {
  if (!globalForMongo.roadnestMongoPromise) {
    globalForMongo.roadnestMongoPromise = client.connect().catch((error) => {
      globalForMongo.roadnestMongoPromise = null;
      throw error;
    });
  }

  return globalForMongo.roadnestMongoPromise;
}

export { client };

export const db = client.db("roadnest");
