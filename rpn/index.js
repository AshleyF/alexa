var APP_ID = "amzn1.echo-sdk-ams.app.ee357bbf-58e6-4c9a-bb5a-4070b0002710";

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
    response.ask("Welcome to RetroCalc",  "");
};

Psi.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Psi onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
};

function num(n) {
    try {
        return parseFloat(n);
    } catch (ex) {
        return NaN;
    }
}

function op(name) {
    function add(x, y) { return num(x) + num(y); }
    function sub(x, y) { return num(x) - num(y); }
    function mul(x, y) { return num(x) * num(y); }
    function div(x, y) { return num(x) / num(y); }
    switch (name) {
        case 'add': return add;
        case 'sum': return add;
        case 'plus': return add;
        case 'subtract': return sub;
        case 'minus': return sub;
        case 'difference': return sub;
        case 'multiply': return mul;
        case 'times': return mul;
        case 'divide': return div;
        default: return null;
    }
}

Psi.prototype.intentHandlers = {
    "calc": function (intent, session, response) {
        var x = intent.slots.numx.value;
        var y = intent.slots.numy.value;
        var z = intent.slots.numz.value;
        var a = op(intent.slots.opa.value);
        var b = op(intent.slots.opb.value);
        if (x && y && a) {
            var v = a(x, y);
            if (z && b) {
                response.tellWithCard("" + b(v, z), "Greeter", "Nothing");
            } else {
                response.tellWithCard("" + v, "Greeter", "Nothing");
            }
        } else {
            response.tellWithCard("What?", "Greeter", "Nothing");
        }
    }
};

exports.handler = function (event, context) {
    var psi = new Psi();
    psi.execute(event, context);
};

