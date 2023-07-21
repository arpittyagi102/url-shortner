const { MongoClient, Db } = require("mongodb");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
 
const MONGO_URI = 'mongodb+srv://arpittyagirocks:arpitmongo@cluster0.1accyoc.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'urlShortner';

let db;
const PORT = 4000;
app.use(bodyParser.json());

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
 .then((client) => {
   console.log("Connected to MongoDB Atlas");
   db = client.db(DB_NAME);
 })
 .catch((err) => {
   console.error(err);
 });

 
app.post('/', (req, res) => {
    const shortUrl = random();
    const { url } = req.body;
    if (url) {
        db.collection('urlmap').insertOne({ url, shortUrl });
        res.json({ "message": "URL shortened successfully", shortUrl });
    }
    else {
        res.status(400).json({ "message": "URL not found" })
    }
})

app.get('/:id',async (req, res) => {
    const { id } = req.params;
    
    const all = db.collection('urlmap');
    const data = await all.findOne({ shortUrl:"5d4ugv8" });

    if(!data){
        return res.json({"message":"Not found"});
    } 
  
    res.redirect(data.url);
  }
);

function random() {
    AllCharactors = "abcdefghijklmnopqrstuvwxyz0123456789";
    var random = '';

    for (let i = 0; i < 7; i++) {
        const randomValue = Math.floor(Math.random() * AllCharactors.length);
        random += AllCharactors[randomValue];
    }

    return random;
}

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});