const express = require('express');
const app =express();
var http = require('http');
const https = require('https')
// const port = process.env.PORT || 3000;
const www = process.env.WWW || './dist';
var fs = require('fs');

const httpsOptions = {
    key: fs.readFileSync('./ssl/localhost.key'),
    cert: fs.readFileSync('./ssl/localhost.crt')
}


app.use(express.static(www));
console.log(`serving ${www}`);
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});
app.post('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});
http.createServer(app).listen(3000);
// eslint-disable-next-line no-unused-vars
https.createServer(httpsOptions, app).listen(3001)


// app.listen(3000, () => console.log(`listening on http://localhost:${3000}`));






// app.get('/', (req, res) => {
//     res.send("IT'S WORKING!")
// })


