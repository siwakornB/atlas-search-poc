const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const agg = [
  {
    $search: {
    "index": "search_index",
      text: {
        query: "harry potter",
        path: "name",
      },
    },
  },
//   {
//     $limit: 5,
//   },
//   {
//     $project: {
//       _id: 0,
//       title: 1,
//       plot: 1,
//     },
//   },
];

// MongoClient.connect(
//   "mongodb+srv://siwakorndev:19qRPVjMOMzAT6BH@cluster0.tobv7.mongodb.net/",
// //   { useNewUrlParser: true, useUnifiedTopology: true },
//   async function (connectErr, client) {
//     assert.equal(null, connectErr);
//     const coll = client.db("test").collection("books");
//     let cursor = await coll.aggregate(agg);
//     console.log(cursor)
//     await cursor.forEach((doc) => console.log(doc));
//     client.close();
//   }
// );

const uri =  
  "mongodb+srv://siwakorndev:19qRPVjMOMzAT6BH@cluster0.tobv7.mongodb.net/";

const client = new MongoClient(uri);

async function run() {
    try {
  
      // set namespace
    //   const database = client.db("test");
    //   const collection = database.collection("books");
      
      const coll = client.db("test").collection("books");
    let cursor = await coll.aggregate(agg);
    console.log(cursor)
    await cursor.forEach((doc) => console.log(doc));
    // client.close();
  
      // run the helper method
    //   const result = await collection.createSearchIndex(index);
    //   console.log(result);
    } finally {
      await client.close();
    }
  }
  
  run().catch(console.dir);
  