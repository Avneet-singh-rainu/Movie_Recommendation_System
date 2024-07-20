require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cp = require("child_process");

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Movie Recommendation API");
});

app.post("/movie", async (req, res) => {
  try {
    const name = req.body.name;

    const pythonProcess = cp.spawn("python", ["py2.py", name]);

    let dataString = '';

    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pythonProcess.stdout.on("end", () => {
      try {
        console.log("Raw data from Python script:", dataString); // Debug print
        const recommendations = JSON.parse(dataString);
        res.status(200).json({ data: recommendations });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.status(500).json({ error: "Failed to parse recommendations" });
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
