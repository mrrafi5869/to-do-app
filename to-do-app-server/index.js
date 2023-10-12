require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9t60goe.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const taskCollection = client.db('toDoApp').collection('taskList');

    app.get("/taskList", async(req, res) => {
        const query = {};
        const taskList = await taskCollection.find(query).toArray();
        res.send(taskList);
    });

    app.post("/postTask", async(req, res) => {
        const task = req.body;
        const postTask = await taskCollection.insertOne(task);
        res.send(postTask);
    });
    app.delete("/deleteTask/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const deleteTask = await taskCollection.deleteOne(query)
        res.send(deleteTask);
    });

  } finally {

  }
}
run().catch(console.dir);


app.get("/", async(req, res) => {
    res.send("to do app server is running");
});

app.listen(port, () => console.log("server is running"));