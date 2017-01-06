var APP_ID = "amzn1.echo-sdk-ams.app.e05c63ae-6a0f-4641-89b5-e9cc98ed6c57";

var AlexaSkill = require('./AlexaSkill');

var Psi = function () { AlexaSkill.call(this, APP_ID); };

Psi.prototype = Object.create(AlexaSkill.prototype);
Psi.prototype.constructor = Psi;

Psi.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Psi onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

Psi.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Psi onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    response.ask("Welcome to Psi. Talk to me Goose.",  "Say something.");
    // response.ask("Howdy",  "Say something.");
};

Psi.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Psi onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
};

// Amazon.Util.ProfileManager.RegisterProfile("default", "AKIAIZ6HIGSOMTUTIKZQ", "vUG4KkVI8650/nECAGuXasFVfsLcEJOyaCpxvZoQ")
// let amazonSQSConfig = new AmazonSQSConfig();
// amazonSQSConfig.ServiceURL <- "http://sqs.us-west-2.amazonaws.com"
// let client = new AmazonSQSClient(amazonSQSConfig)

var AWS = require('aws-sdk');
// var QUEUE_URL = 'https://sqs.us-west-2.amazonaws.com/660181231855/Alexa';
// var sqs = new AWS.SQS({region : 'us-west-2'});

var QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/660181231855/Psi';
var sqs = new AWS.SQS({region : 'us-east-1'});

Psi.prototype.intentHandlers = {
    "PsiDictation": function (intent, session, response) {
        try {
            // postToQueue(intent.slots.dictation.value, function (status) { });
            var params = { MessageBody: intent.slots.dictation.value, QueueUrl: QUEUE_URL };
            sqs.sendMessage(params, function(err, data){
                if(err) {
                    response.tellWithCard("Psi error: " + JSON.stringify(err), "Greeter", "Nothing");
                } else {
                    var dict = intent ? (intent.slots ? (intent.slots.dictation ? (intent.slots.dictation.value ? intent.slots.dictation.value : "Missing value") : "Missing dictation") : "Missing slots") : "Missing intent";
                    // response.tellWithCard(dict.split(" ").reverse().join(" "), "Greeter", "Nothing");
                    // response.tellWithCard("Psi heard: " + dict.split(" ").reverse().join(" "), "Greeter", "Nothing");
                    response.tellWithCard("", "Greeter", dict);
                }
            });
        } catch(ex) {
            // setTimeout(function () {
                response.tellWithCard("Psi exception: " + JSON.stringify(ex), "Greeter", "Nothing");
            // }, 5000);
        }
    }
};

exports.handler = function (event, context) {
    var psi = new Psi();
    psi.execute(event, context);
};
