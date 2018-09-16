var AWS = require('aws-sdk');

console.log('Loading function');

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });

    switch(event.path) {
        case '/schedule':
            switch (event.httpMethod) {
                case 'GET':
                    getSchedule(done);
                    break;
                case 'POST':
                    saveSchedule(event.body, done);
                    break;
                default:
                    done(new Error(`Unsupported method "${event.httpMethod}"`));
            }
            break;

        default:
            done(new Error(`Unsupported path "${event.path}"`));
    }
};

const BUCKET = "bowling-schedule";
const KEY = "schedule-2018.json";

function getSchedule(done) {
    var params = {
        Bucket: BUCKET, 
        Key: KEY
       };
    var s3 = new AWS.S3();
    s3.getObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); 
            done(err);
        }
        else {
            console.log(data.Body.toString());
            done(null, JSON.parse(data.Body.toString()));
        }
    });
}

function saveSchedule(body, done) {
    var params = {
        Bucket: BUCKET, 
        Key: KEY,
        Body: body
       };
    var s3 = new AWS.S3();
    s3.putObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); 
            done(err);
        }
        else {
            done();
        }
    });
}