/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.bf97f773-f812-4c9b-9553-e7481161cfaa';

const SKILL_NAME = 'Bowling Stones Schedule';
const HELP_MESSAGE = 'You can say what is the schedule this week, or, some more stuff... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const handlers = {
    'LaunchRequest': function () {
        this.emit('WhoBowlsThisWeekIntent');
    },
    'WhoBowlsThisWeekIntent': function () {
        console.log("In WhoBowlsThisWeekIntent");
        const todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);
    
        var alexaThis = this;
        getWhosBowling(todaysDate, function(textToSay) {
            console.log("Get text to say", textToSay);
            alexaThis.response.cardRenderer(SKILL_NAME, textToSay);
            alexaThis.response.speak(textToSay);
            alexaThis.emit(':responseReady');
        })
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const BUCKET = "bowling-schedule";
const KEY = "schedule-2018.json";

function getWhosBowling(baseDate, done) {
    getSchedule(function(err, scheduleData) {
        if (err) {
            done("We could not get the schedule at this time.");
            return;
        }

        var response = "The people bowling are ";
        for (let dateIndex = 0; dateIndex < scheduleData.schedule.length; dateIndex++) {
            var scheduleDataRow = scheduleData.schedule[dateIndex];
            var currentDate = new Date(scheduleDataRow.date);
            currentDate.setHours(0, 0, 0, 0);
            if (currentDate.getTime() >= baseDate.getTime()) {
                for (let bowlerIndex = 0; bowlerIndex < scheduleDataRow.bowlers.length; bowlerIndex++) {
                    if (!scheduleDataRow.bowlers[bowlerIndex]) {
                        response += scheduleData.bowlers[bowlerIndex] + ", ";
                    }
                }
                done(response);
            }
        }
        done("No schedule could be found");
    });
}

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
            done(null, JSON.parse(data.Body.toString()));
        }
    });
}
