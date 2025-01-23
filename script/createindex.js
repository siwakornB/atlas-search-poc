const { MongoClient } = require("mongodb");

// connect to your Atlas deployment
const uri =  
  "mongodb+srv://siwakorndev:19qRPVjMOMzAT6BH@cluster0.tobv7.mongodb.net/";

const client = new MongoClient(uri);

async function run() {
  try {

    // set namespace
    const database = client.db("test");
    const collection = database.collection("books");
    
    // define your Atlas Search index
    const index = {
        name: "search_index",
        definition: {
            /* search index definition fields */
            "mappings": {
                "dynamic": true
            }
        }
    }

    // run the helper method
    const result = await collection.createSearchIndex(index);
    console.log(result);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
