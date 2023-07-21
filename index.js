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
    const { url, expiry } = req.body;
    if (url && expiry) {
        db.collection('urlmap').insertOne({ url, shortUrl,expiry });
        res.json({ "message": "URL shortened successfully", shortUrl });
    }
    else {
        res.status(400).json({ "message": "URL not found" })
    }
})

app.get('/:id',async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const all = db.collection('urlmap');
    const data = await all.findOne({ shortUrl:id });

    if(!data){
        return res.json({"message":"Not found"});
    } 

    if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
        return res.json({ "message": "Short URL has expired" });
    }
  
    res.redirect(data.url);
  }
);

app.post('/update', async (req, res) => {
    const { shortUrl, newUrl } = req.body;
    if (!shortUrl || !newUrl) {
        return res.status(400).json({ "message": "complete data not found" });
    }

    const existingUrl = await db.collection('urlmap').findOne({ shortUrl });
    if (!existingUrl) {
        return res.status(404).json({ "message": "Short URL not found in db" });
    }

    db.collection('urlmap').updateOne({ shortUrl }, { $set: { url: newUrl } });
    res.json({ "message": "Destination URL updated successfully", shortUrl, newUrl });
});

app.post('/updateExpiry', async (req, res) => {
    const { shortUrl, daysToAdd } = req.body;

    if (!shortUrl || !daysToAdd) {
        return res.status(400).json({ "message": "complete data not found" });
    }

    const existingUrl = await db.collection('urlmap').findOne({ shortUrl });

    if (!existingUrl) {
        return res.status(404).json({ "message": "Short URL not found in db" });
    }

    const newExpiry = existingUrl.expiry + daysToAdd;

    await db.collection('urlmap').updateOne(
        { shortUrl },
        { $set: { expiry: newExpiry } }
    );

    res.json({ "message": "Expiry date updated successfully", expiry });
});


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