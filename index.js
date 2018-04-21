'use strict';

const express = require('express'),
      app = express();

app.use(require('./login'));
app.use(require('./file'));

app.use(express.static('public'));
app.get('/', function(req, res, next) {
    
});

app.listen(8080, () => {
    console.log("The server is listening port 8080.");
});
