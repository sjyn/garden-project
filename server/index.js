const express = require('express');
const app = express();
const port = 8432;

const requestQueue = [];

app.get('/', (request, response) => {
    console.log('got request');
    response.send('Hello, world');
});

app.post('/turn-on', (request, response) => {
    requestQueue.push("on");
    console.log(requestQueue)
    response.status(200).send('request added')
});

app.get('/requests', (request, response) => {
    const mRequest = requestQueue.pop();
    if (!!mRequest) {
        response.status(200).send(mRequest);
    } else {
        response.status(200).send('empty');
    }
});

app.listen(port, () => {
    console.log('started server!');
});