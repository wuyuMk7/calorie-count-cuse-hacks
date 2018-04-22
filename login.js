'use strict';

const router = require('express').Router();

router.post('/login', function(req, res, next){
    let name = req.body.username;
    let pwd = req.body.password;

    const query = req.app.locals.datastore.createQuery('Task');

    query.filter('username', name).run().then((entities) => {
        //        if (entities.length)
        //console.log(entities[0][0].password);
        if (entities != undefined && entities[0] != undefined) {
            let user = entities[0][0];
            if (user != undefined) {
                if(pwd == user.password) {
                    req.session.login = 1;
                    req.session.username = name;
                    res.json({ status: 'success', url: '/user' });
                } else {
                    return Promise.reject(new Error("403"));
                }
            } else {
                return Promise.reject(new Error("403"));
            }
        }
        else {
            return Promise.reject(new Error("403"));
        }
    }).catch((err) => {
        if (err.message == '403')
            res.sendStatus(403);
        else {
            next(err);
        }
    });

});

module.exports = router;

