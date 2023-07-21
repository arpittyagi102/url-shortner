const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log(random());
    if (req.body.url) {
        const { url } = req.body;
        res.json({ "message": "hello", url })
    }
    else {
        res.status(400).json({ "message": "URL not found" })
    }
})

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