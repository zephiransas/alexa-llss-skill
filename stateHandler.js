'use strict';

let s3 = require('./s3');

let stateHandlers = {
    'LaunchRequest': function () {
        this.emit('PlayAudio');
    },
    'PlayAudio': function () {
      // play the radio
      let self = this;
      s3.find()
        .then((key) => { return s3.get_signed_url(key); })
        .then((url) => {
          self.response.speak(this.t('START_MSG')).audioPlayerPlay('REPLACE_ALL', url, 'llss', null, 0);
          self.emit(':responseReady');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    'AMAZON.HelpIntent': function () {
        this.response.listen(this.t('HELP_MSG'));
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        // No session ended logic
    },
    'ExceptionEncountered': function () {
        console.log("\n******************* EXCEPTION **********************");
        console.log("\n" + JSON.stringify(this.event.request, null, 2));
        this.callback(null, null)
    },
    'Unhandled': function () {
        this.response.speak(this.t('UNHANDLED_MSG'));
        this.emit(':responseReady');
    },
    'AMAZON.NextIntent': function () {
        this.response.speak(this.t('CAN_NOT_SKIP_MSG'));
        this.emit(':responseReady');
    },
    'AMAZON.PreviousIntent': function () {
        this.response.speak(this.t('CAN_NOT_SKIP_MSG'));
        this.emit(':responseReady');
    },

    'AMAZON.PauseIntent':   function () { this.emit('AMAZON.StopIntent'); },
    'AMAZON.CancelIntent':  function () { this.emit('AMAZON.StopIntent'); },
    'AMAZON.StopIntent':    function () {
      this.response.speak(this.t('STOP_MSG')).audioPlayerStop();
      this.emit(':responseReady');
    },

    'AMAZON.ResumeIntent':  function () {
      // TODO: Play with offset...
      let self = this;
      s3.find()
        .then((key) => { return s3.get_signed_url(key); })
        .then((url) => {
          self.response.speak(this.t('START_MSG')).audioPlayerPlay('REPLACE_ALL', url, 'llss', null, 0);
          self.emit(':responseReady');
        })
        .catch((err) => {
          console.log(err);
        });
    },

    'AMAZON.LoopOnIntent':     function () { this.emit('AMAZON.StartOverIntent'); },
    'AMAZON.LoopOffIntent':    function () { this.emit('AMAZON.StartOverIntent');},
    'AMAZON.ShuffleOnIntent':  function () { this.emit('AMAZON.StartOverIntent');},
    'AMAZON.ShuffleOffIntent': function () { this.emit('AMAZON.StartOverIntent');},
    'AMAZON.StartOverIntent':  function () {
        this.response.speak(this.t('NOT_POSSIBLE_MSG'));
        this.emit(':responseReady');
    },

    /*
     *  All Requests are received using a Remote Control. Calling corresponding handlers for each of them.
     */
    'PlayCommandIssued':  function () { controller.play.call(this, this.t('WELCOME_MSG')) },
    'PauseCommandIssued': function () { controller.stop.call(this, this.t('STOP_MSG')) }
}

module.exports = stateHandlers;
