const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Threat Intelligence API is running...");
});

const lookupRoutes = require("./routes/lookup.js");
app.use("/api/lookup", lookupRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
