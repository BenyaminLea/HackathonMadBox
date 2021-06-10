const express = require("express");
const app = express();
const port = 5000;
var cors = require("cors");

require("dotenv").config();

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./token.json";
const projectId = "robust-seat-301020";
const location = "global";

const { TranslationServiceClient } = require("@google-cloud/translate");
const translationClient = new TranslationServiceClient();

async function translateText(text) {
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain",
    sourceLanguageCode: "fr",
    targetLanguageCode: "en",
  };
  try {
    const [response] = await translationClient.translateText(request);
    return response.translations[0].translatedText;
  } catch (error) {
    console.error(error.details);
  }
}

const { MongoClient } = require("mongodb");
const url = process.env.URL;
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = "words";
let words_collection = "";
let numberOfWords = 0;

client.connect().then((response) => {
  if (response.topology.s.state) {
    console.log("Status: " + response.topology.s.state);
    const db = client.db(dbName);
    words_collection = db.collection("words");
    all_words = words_collection
      .find()
      .toArray()
      .then((words) => {
        numberOfWords = words.length;
      });
  } else {
    console.log("Problem connecting to MongoDB");
  }
});

const getRandomNumber = () => {
  let id = Math.floor(Math.random() * numberOfWords) + 1;
  return id;
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const random = getRandomNumber();
  words_collection
    .findOne({
      _id: random,
    })
    .then((word) => {
      translateText(word.french).then((english) => {
        res.json({ french: word.french, english: english });
      });
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
