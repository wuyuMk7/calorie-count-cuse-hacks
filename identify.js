'use strict';

((img) => {
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();

    client
        .labelDetection(img)
        .then(results => {
            const labels = results[0].labelAnnotations;

            console.log('Labels:');
            labels.forEach(label => console.log(label.description));
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
})('./public/upload/testApple.jpg');
