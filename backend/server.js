const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// CONTACT API (TEST)
app.post("/api/contact", (req, res) => {
  console.log("Received from frontend:", req.body);
  res.json({ message: "Contact API working" });
});

app.listen(5000, () => {
  console.log("Backend working on port 5000");
});
