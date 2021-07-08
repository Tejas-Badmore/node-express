const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const empRouter = require('./routers/empRouter');

const hostname = "localhost",
    port = 3000;

const app = express();
app.use(morgan('dev'));   //provide incoming request information
app.use(bodyParser.json());   //using json body-parser
app.use('/employee', empRouter);    //routing all the request for /employee to empRouter

app.use(express.static(__dirname + '/public'));       //serves static files under directory name

app.use((req, res, next) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});


const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});