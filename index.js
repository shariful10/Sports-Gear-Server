const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.bq2ef3t.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		const userCollection = client.db("sportsDb").collection("users");
		const classCollection = client.db("sportsDb").collection("classes");
		const instructorCollection = client.db("sportsDb").collection("instructors");

		// User collection
		app.get("/users", async (req, res) => {
			const result = await userCollection.find().toArray();
			res.send(result);
		});

		app.post("/users", async (req, res) => {
			const user = req.body;
			const query = { email: user.email };
			const existingUser = await userCollection.findOne(query);

			if (existingUser) {
				return res.send({ message: "User already exists" });
			}

			const result = await userCollection.insertOne(user);
			res.send(result);
		});

		app.patch("/users/admin/:id", async (req, res) => {
			const id = req.params.id;
			const { role } = req.body;
			const filter = { _id: new ObjectId(id) };
			const updateDoc = {
				$set: {
					role: role,
				},
			};
			const result = await userCollection.updateOne(filter, updateDoc);
			res.send(result);
		});

		// Classes Collection
		app.get("/classes", async (req, res) => {
			const result = await classCollection.find().toArray();
			res.send(result);
		});

		// Instructors Collection
		app.get("/instructors", async (req, res) => {
			const result = await instructorCollection.find().toArray();
			res.send(result);
		});

		// Cart Collection

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Sports Gear is running now");
});

app.listen(port, () => {
	console.log(`Sports Gear is running on port: ${port}`);
});
