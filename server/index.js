const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const scrape = require('./scrape');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

app.get('/api/nusmods/:url', async (req, res, next) => {
    const timetable = await scrape(req.params.url);
    console.log(timetable);
    if(!timetable) {
        res.status(404).send(`The url '${req.params.url}' is not valid.`);
    }
    else {
        res.send(timetable);
    }
});

module.exports = app;