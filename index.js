const { MongoClient, ServerApiVersion } = require("mongodb");
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
    // insert service
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollaction.insertOne(service);
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
