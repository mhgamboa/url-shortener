require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const connectDB = require("./db/connect");
const URL = require("./models/url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log("req.originalUrl:", req.originalUrl);
  console.log("req.path:", req.path);
  next();
});

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", async function (req, res) {
  const original_url = req.body.url;
  const regex = /^http:\/\//;
  if (!original_url.match(regex)) return res.json({ error: "invalid url" });

  try {
    const short_url = (await URL.find({}).count()) + 1;
    await URL.create({ original_url, short_url });
    res.json({ original_url, short_url });
  } catch (e) {
    console.error(e);
    return res.json({ error: "Error Occurred. You broke my code" });
  }
});

app.get("/api/shorturl/:shorturl", async function (req, res) {
  console.log(req.params);
  try {
    const short_url = parseInt(req.params.shorturl);
    const url = await URL.findOne({ short_url });
    res.redirect(url.original_url);
  } catch (e) {
    console.error("failed to retrive by short url");
    console.error(e);
    return res.json({ error: "Error Occurred. You broke my code" });
  }
});

const main = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error("db failed");
  }
};
main();
