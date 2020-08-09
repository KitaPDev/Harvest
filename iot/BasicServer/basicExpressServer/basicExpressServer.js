const express = require('express');
const bodyParser= require('body-parser');
const app = express();

app.use(bodyParser.json({extended : true}));

bodyString : String;

app.post('/testData', (req, res) => {
    let bodyString = req.body;
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(time + " Got Body: ", bodyString);
    res.sendStatus(200);
})

app.listen(3000, () => console.log('Server on http://localhost:3000'));