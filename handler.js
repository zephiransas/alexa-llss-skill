'use strict';

let alexa = require('alexa-sdk');
let constants = require('./constants');
let stateHandler = require('./stateHandler');
let languageStrings = require('./strings');

exports.handler = (event, context, callback) => {
  var skill = alexa.handler(event, context, callback);

  skill.appId     = constants.appId;
  skill.resources = languageStrings;
  skill.debug     = constants.debug;
  skill.registerHandlers(
      stateHandler
      // audioEventHandlers
  );

  if (skill.debug) {
      console.log("\n" + "******************* REQUEST **********************");
      console.log("\n" + JSON.stringify(event, null, 2));
  }

  skill.execute();
};