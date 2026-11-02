require("dotenv").config();

const express = require("express");
const cors = require("cors");

const factCheckRoutes = require("./routes/factCheckRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI Fact Checker Backend is running"
    });
});

app.use("/api/fact-check", factCheckRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});