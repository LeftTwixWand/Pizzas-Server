import { MongoClient } from "mongodb";

// const connectionString = process.env.CONNECTION_STRING;
const connectionString =
  "mongodb+srv://GreenfieldTaster:PVZ63MghNNFgXJN@pizzas-backed-cluster.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

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
