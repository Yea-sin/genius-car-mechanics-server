const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.quagy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
/* const uri = `mongodb+srv://geniusMechanic:wS24pw1kgpglKpra@cluster0.quagy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; */
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanics");
    const serviceCollection = database.collection("services");

    // GET API
    app.get("/services", async (req, res) => {
      console.log("getting");
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();

      res.send(services);
    });

    // GET SINGLE API
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      console.log("hitting id", id);
      console.log(service);
      res.json(service);
    });

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.deleteOne(query);
      res.json(service);
    });

    // POST API
    app.post("/services", async (req, res) => {
      // console.log("hit the api");
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      console.log(result);

      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("OPENING GENIUS MECHANICS SERVER");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
