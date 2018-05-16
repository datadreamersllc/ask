const Alexa = require('alexa-sdk');
const request = require('request');
const APP_ID = 'amzn1.ask.skill.3adc23da-c28d-4034-98ea-6674b2770320';

//common phrase
const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'iwantameal.com',
            HELP_MESSAGE: 'Welcome to our skill, ask Where Is My Food to find the status of your delivery',
            LINK_MESSAGE: 'Welcome to our skill, you have not linked your account yet, open the Alexa app and click on, Link account, to query the status of your order.',
            SETSTOP_MESSAGE: 'OK, open the Alexa app and click on, Link account.',
            HELP_REPROMPT: 'What can I help you with?',
            UNHANDLED_MESSAGE: "Sorry, I didn't get that. What can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            OK: 'OK'
        }
    }
};



const wheresMyFood = function() {
        //console.log('this.event', JSON.stringify(this.event));
        const speechOutput = this.t('HELP_MESSAGE');
        //setup check
        if(this.event.session.user.accessToken){
            //setup has been done
            //ask for an action
	   console.log(this.event.session.user.accessToken);
	   var atcocode = this.event.session.user.accessToken;
           var self = this;
	   const options = {  
	       url: 'https://api.authlete.com/api/auth/userinfo',
	       method: 'POST',
	       headers: {
	           'Accept': 'application/json',
	           'Accept-Charset': 'utf-8',
	           'Content-Type':'application/json',
	           'User-Agent': 'aws-lambda-function'
	       },
	       'auth': {
	           'user': '5938097293667',
	           'pass': 'IoJ526dF547ms37ObQnT3GQaml5d7f8Z3SXO-EvAvBU'
 	        },
 	      json: {
	          "token": atcocode
	       }
	   };
           request(options, (error, response2, body) => {
               // let json = JSON.parse(body);
               //console.log('error:', error); // Print the error if one occurred
               //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
               //console.log('body:', body); // Print the body
	       //let parsedData = JSON.parse(body);
               //var user_email = parsedData.subject;
               console.log('email:', body.subject); 
               const options2 = {  
                   url: 'http://23.22.247.129/?ddurl=www.iwantameal.com/alexa_order_status.xsl',
                   method: 'POST',
                   headers: {
                       'Accept': 'application/json',
                       'Accept-Charset': 'utf-8',
                       'Content-Type':'application/json',
                       'User-Agent': 'aws-lambda-function'
                   },
                   json: {
                      "email": body.subject,
                      "authlete_key": atcocode
                   }
               };
               request(options2, (error2, response3, body2) => {
                   console.log('body2:', body2); // Print the body
                   this.response.cardRenderer(self.t('SKILL_NAME'), "hihi");
                   this.response.speak(body2.message);
                   this.emit(':responseReady');
               });
           });
        } else {
            //setup has not been done
            //send a link account card
            const speechOutput = this.t('LINK_MESSAGE');
            this.emit(':tellWithLinkAccountCard', speechOutput);
        }
}




//Intent handler
const handlers = {
    //Launch request handler
   'LaunchRequest': wheresMyFood,
    //SetHomeStop intent handler
    'WheresMyFood': wheresMyFood,
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function() {
        this.emit(':ask', this.t('UNHANDLED_MESSAGE'), this.t('HELP_REPROMPT'));
    }
};

// Lambda handler
exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
