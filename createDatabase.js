const fs = require("fs");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const url = process.env.URL;
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = "words";

async function createDataBase() {
  try {
    let id = 0;
    const words = [];
    const data = fs.readFileSync("./verbe.txt", "UTF-8");
    const lines = data.split(/\r?\n/);
    lines.forEach((line) => {
      const wordObject = {
        _id: id,
        french: line,
      };
      id = id + 1;
      words.push(wordObject);
    });
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    const words_collection = db.collection("words");
    newWordDB = await words_collection.insertMany(words);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

//createDataBase();
