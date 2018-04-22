'use strict';

const express = require('express'),
      app = express(),
      session = require('express-session');

const bodyParser = require('body-parser');

const Datastore = require('@google-cloud/datastore');
const projectId = 'calorie-count-201820';

const datastore = new Datastore({
    projectId: projectId
});

app.locals.datastore = datastore;

var fs = require('fs');
var multer  = require('multer');

var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './public/upload/';

createFolder(uploadFolder);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);   
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({ storage: storage });

app.use(session({
    secret: 'cusehacks',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(require('./login'));

app.get('/user', function(req, res, next) {
    /*
    if (req.session.login == undefined || req.session.username == undefined) {
        res.status(403).end('403 forbidden');
        console.log("403");
        //next(new Error("403"));
    } else {
        console.log("Welcome!");
        res.sendFile(__dirname + '/public/user.html');
    }
    */
    res.sendFile(__dirname + '/public/user.html');
});

app.post('/upload', upload.single('food-image'), function(req, res, next){
    var file = req.file;

    console.log('File Type：%s', file.mimetype);
    console.log('Original Name：%s', file.originalname);
    console.log('Size：%s', file.size);
    console.log('Save Path：%s', file.path);

    res.json({status: "success"});
    //res.send({ret_code: '0'});
});

/*
let entity = {
    key: {
        kind: 'Task',
        id: '5639445604728832'
    },
    data: {
        label: ['apple', 'orange', 'potato', 'egg', 'bacon']
    }

};

datastore.update(entity).then((res)=>{console.log(res);}).catch((err)=>{console.log(err);});

app.get('/testdb', function(req, res, next){
    
    let taskKey = app.locals.datastore.key('Task');
    let entity = {
        key: {
            kind: 'Task',
            id: '5629499534213120'
        },
        data: {
            username: 'admin',
            calories: [
                {
                    name: 'apple',
                    img: './public/upload/apple.jpg',
                    calorie: 52,
                    weight: 100
                }
            ]
        }
    };
    datastore.update(entity).then((res)=>{console.log(res);}).catch((err)=>{console.log(err);});
});
*/

app.use(require('./file'));

app.get('/', function(req, res, next) {
    
});

app.use(function (err, req, res, next) {
    console.log(err);
});

app.listen(8080, () => {
    console.log("The server is listening port 8080.");
});
