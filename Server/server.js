require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

app.use(cors());
//**************************************************************************************** */ */
const port = process.env.PORT;
const cp = require("child_process");
const { configDotenv } = require("dotenv");


//****************************************************************************************** */

app.get("/", (req, res) => {
  res.status(200);
});

app.post("/movie", async (req, res) => {
  try {
    const namee = req.body.name;

    const recomendations = 5;
    const pythoncode = await cp.spawn("python", [
      "pyth.py",
      namee,
      recomendations,
    ]);

    pythoncode.stdout.on("data", (data) => {
      newSuggestion = JSON.parse(data);
      res.status(200).json(newSuggestion.data);
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log("Server Started...");
});
