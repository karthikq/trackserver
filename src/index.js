require("dotenv").config();
require("./models/User");
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = `mongodb+srv://testuser:${process.env.MONGO_PASS}@cluster0.44gx5.mongodb.net/reactnativetracker?retryWrites=true&w=majority`;

if (!mongoUri) {
  throw new Error(
    `MongoURI was not supplied.  Make sure you watch the video on setting up Mongo DB!`
  );
}
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});
app.listen(PORT, () => {
  console.log("Listening on port 5000");
});
