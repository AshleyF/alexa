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
    response.ask("Welcome to Psi. Talk to me, Goose.",  "Say something.");
    // response.ask("Howdy",  "Say something.");
};

Psi.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Psi onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
};

// Amazon.Util.ProfileManager.RegisterProfile("default", "AKIAIZ6HIGSOMTUTIKZQ", "vUG4KkVI8650/nECAGuXasFVfsLcEJOyaCpxvZoQ")
// let amazonSQSConfig = new AmazonSQSConfig();
// amazonSQSConfig.ServiceURL <- "http://sqs.us-west-2.amazonaws.com"
// let client = new AmazonSQSClient(amazonSQSConfig)

function toPigLatin(phrase) {
    function isVowel(char) {
        return ['a', 'e', 'i', 'o', 'u'].indexOf(char) != -1;
    }
    function consonant(text) {
        i = 0;
        while (!isVowel(text.charAt(i)))
        i++;
        return text.substring(i) + text.substring(0, i) + "ay";
    }
    function vowel(text) {
        if (text.charAt(text.length - 1) == 's')
        return text.substring(0, text.length -1) + "ays";
        return text + "ay";
    }
    function wordProcessor(text) {
        if (isVowel(text.charAt(0)))
            return vowel(text);
        else
        return consonant(text);
    }
    endPhrase = "";
    for (var i = 0; phrase.length > 0; i++) {
        if (phrase[i] == null || phrase[i] == " ") {
            endPhrase += wordProcessor(phrase.substring(0, i)) + " ";
            if (phrase[i] == " ")
                phrase =  phrase.substring(i + 1);
            else
                phrase = phrase.substring(i);
            i = -1;
        }
        if (phrase.length == 1) {
            endPhrase += wordProcessor(phrase);
            phrase = "";
        }
    }
    return endPhrase;
}

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
                    // response.tellWithCard(toPigLatin(dict.toLowerCase()), "Greeter", "Nothing");
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

