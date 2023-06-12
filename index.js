const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Sports Gear is running");
});

app.listen(port, () => {
	console.log(`Sports Gear is running on port: ${port}`);
});
