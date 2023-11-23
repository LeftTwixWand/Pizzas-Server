import "dotenv/config";
import { MongoClient } from "mongodb";

const connectionString = process.env.CONNECTION_STRING;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
});

var _cluster;

export default {
  getDatabase: (databaseName) => {
    let database = _cluster.db(databaseName);
    console.log(`Connected to database ${databaseName}`);
    return database;
  },
  connectToCluster: async function (callback) {
    let cluster = await client.connect();
    if (cluster) {
      _cluster = cluster;
      console.log("Connected to cluster");
    }
  },
};
