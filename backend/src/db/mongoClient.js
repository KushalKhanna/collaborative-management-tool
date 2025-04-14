// backend/db/mongoClient.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://kushal7khanna:WxRq6wmL7Ixwkded@cluster0.ih6aeef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  ssl: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let isConnected = false;

async function connectToDb() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  }
  return client;
}

module.exports = connectToDb;