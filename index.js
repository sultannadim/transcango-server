const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// mongodb start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.newitlb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollaction = client
      .db("deliveryService")
      .collection("services");
    const reviewCollaction = client.db("deliveryService").collection("reviews");
    // insert service
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollaction.insertOne(service);
      res.send(result);
    });
    // limit service find
    app.get("/service-limit", async (req, res) => {
      const query = {};
      const cursor = serviceCollaction.find(query).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get all service
    app.get("/services", async (req, res) => {
      const query = {};
      const curson = serviceCollaction.find(query);
      const result = await curson.toArray();
      res.send(result);
    });
    // get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollaction.findOne(query);
      res.send(service);
    });
    // insert review in database
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollaction.insertOne(review);
      res.send(result);
    });
    // get service review
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.productId) {
        query = {
          productId: req.query.productId,
        };
      }
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollaction.find(query).sort({ _id: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollaction.deleteOne(query);
      res.send(result);
    });
    // review update
    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const reviews = req.body;

      const docUpdate = {
        $set: {
          review: reviews.review,
        },
      };
      const result = await reviewCollaction.updateOne(
        query,
        docUpdate,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

// mongodb end

app.get("/", (req, res) => {
  res.send("Delivery service review api is running");
});

app.listen(port, () => {
  console.log(`review server running from port : ${port}`);
});
