const express = require("express");
const app = express();
const port = 5000;
var cors = require("cors");

require("dotenv").config();

const { MongoClient } = require("mongodb");
const url = process.env.URL;
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbName = "rankings";

client.connect().then((response) => {
  if (response.topology.s.state) {
    console.log("Status: " + response.topology.s.state);
    const db = client.db(dbName);
    rankings = db.collection("rankings");
    all_rankings = rankings.find().toArray();
  } else {
    console.log("Problem connecting to MongoDB");
  }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  rankings.find().toArray();
});

app.get("/top10", (req, res) => {
  rankings
    .find({})
    .sort({ averageScore: -1 })
    .limit(10)
    .then((ranks) => res.json(ranks));
});

app.post("/score", async (req, res) => {
  const { Score, Username } = req.body;
  await rankings.insert({ Username, Score });
  res.send("Score saved");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
