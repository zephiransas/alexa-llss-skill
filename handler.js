'use strict';

let alexa = require('alexa-sdk');
let stateHandler = require('./stateHandler');
let audioEventHandlers = require('./audioEventHandlers');
let languageStrings = require('./strings');

exports.handler = (event, context, callback) => {
  var skill = alexa.handler(event, context, callback);

  skill.appId     = process.env.APP_ID;
  skill.resources = languageStrings;
  skill.debug     = true;
  skill.registerHandlers(
      stateHandler,
      audioEventHandlers
  );

  if (skill.debug) {
      console.log("\n" + "******************* REQUEST **********************");
      console.log("\n" + JSON.stringify(event, null, 2));
  }

  skill.execute();
};
