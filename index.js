

const alexaSDK = require('alexa-sdk');
const awsSDK = require('aws-sdk');
const promisify = require('es6-promisify');
const appId = 'amzn1.ask.skill.69497888-178e-442a-8599-2fab43f4af94';
const projectsTable = 'Project';
const docClient = new awsSDK.DynamoDB.DocumentClient();

const instructions = `Welcome to Brunel University Student showcase event<break strength="medium" />
                       we would like to get you opinion about the showcase event and your favorite project as well.
                       <break strength="medium" /> You can start adding your opinion by saying the command: add opinion.`;

                     

const handlers = {

  /**
   * Triggered when the user says "Alexa, open Brunel showcase.
   */
  'LaunchRequest'() {
    this.emit(':ask', instructions);
  },

  /**
   * Adds a opinion to the current user's saved opinions.
   * Slots: ProjectName, ProjectOpinion.
   */
  'AddOpinionIntent'() {
    const { userId } = this.event.session.user;
    const { slots } = this.event.request.intent;

    // prompt for slot values and request a confirmation for each



// ShowCaseOpinion
    if (!slots.ShowCaseOpinion.value) {
      const slotToElicit = 'ShowCaseOpinion';
      const speechOutput = 'Could you please briefly tell me your opinion about the showcase ?';
      const repromptSpeech = 'Could you please briefly tell me your opinion about the showcase ?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.ShowCaseOpinion.confirmationStatus !== 'CONFIRMED') {

      if (slots.ShowCaseOpinion.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'ShowCaseOpinion';
        const speechOutput = `Your opinion about the showcase is ${slots.ShowCaseOpinion.value}, correct?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'ShowCaseOpinion';
      const speechOutput = 'Could you please briefly tell me your opinion about the showcase ?';
      const repromptSpeech = 'Could you please briefly tell me your opinion about the showcase ?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }


    // ProjectTableNumber
    if (!slots.ProjectTableNumber.value) {
      const slotToElicit = 'ProjectTableNumber';
      const speechOutput = 'Now I would like to ask you about your favorite project. Could you please tell me the table number of your favorite project ?';
      const repromptSpeech = 'Now I would like to ask you about your favorite project. Could you please tell me the table number of your favorite project ?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.ProjectTableNumber.confirmationStatus !== 'CONFIRMED') {

      if (slots.ProjectTableNumber.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'ProjectTableNumber';
        const speechOutput = `The table number of your favorite project is ${slots.ProjectTableNumber.value}, correct?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'ProjectTableNumber';
      const speechOutput = 'Could you please tell me the table number of your favorite project ?';
      const repromptSpeech = 'Could you please tell me the table number of your favorite project ?';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    // ProjectRate
    if (!slots.ProjectRate.value) {
      const slotToElicit = 'ProjectRate';
      const speechOutput = 'Using out of 5 rating system, how much you would like to give the project?';
      const repromptSpeech = 'Please give a number out of 5.';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.ProjectRate.confirmationStatus !== 'CONFIRMED') {

      if (slots.ProjectRate.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'ProjectRate';
        const speechOutput = `The project rate is ${slots.ProjectRate.value}, correct?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'ProjectRate';
      const speechOutput = 'Using out of 5 rating system, how much you would like to give the project?';
      const repromptSpeech = 'Please give a number out of 5.';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    // ProjectOpinion
    if (!slots.ProjectOpinion.value) {
      const slotToElicit = 'ProjectOpinion';
      const speechOutput = 'Please briefly tell us about your opinion on the project';
      const repromptSpeech = 'Please briefly tell us about your opinion on the project';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }
    else if (slots.ProjectOpinion.confirmationStatus !== 'CONFIRMED') {

      if (slots.ProjectOpinion.confirmationStatus !== 'DENIED') {
        // slot status: unconfirmed
        const slotToConfirm = 'ProjectOpinion';
        const speechOutput = `Your opinion that you have just said is, ${slots.ProjectOpinion.value} , correct?`;
        const repromptSpeech = speechOutput;
        return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
      }

      // slot status: denied -> reprompt for slot data
      const slotToElicit = 'ProjectOpinion';
      const speechOutput = 'Please briefly tell us about your opinion on the project';
      const repromptSpeech = 'Please briefly tell us about your opinion on the project';
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    // all slot values received and confirmed, now add the record to DynamoDB
    const showCaseOpinion = slots.ShowCaseOpinion.value;
    const tableNumber = slots.ProjectTableNumber.value;
    const rate = slots.ProjectRate.value;
    const opinion = slots.ProjectOpinion.value;
    const dynamoParams = {
      TableName: projectsTable,
      Item: {
        TableNumber: tableNumber,
        UserId: userId,
        ShowCaseOpinion:showCaseOpinion,
        ProjectRate: rate,
        Opinion: opinion
      }
    };

    const checkIfProjectExistsParams = {
      TableName: projectsTable,
      Key: {
        TableNumber: tableNumber,
        UserId: userId
      }
    };

    console.log('Attempting to add a project', dynamoParams);

    // query DynamoDB to see if the item exists first
    
    docClient.get(checkIfProjectExistsParams).promise()
      .then(data => {
        console.log('Get item succeeded', data);

        const project = data.Item;

        if (false) {
          const errorMsg = `Project  already exists!`;
          this.emit(':tell', errorMsg);
          throw new Error(errorMsg);
        }
        else {
          // no match, add the recipe
          //return dbPut(dynamoParams);
           return  docClient.put(dynamoParams).promise();
        }
      })
      .then(data => {
        console.log('Add item succeeded', data);

        this.emit(':tell', `Your opinion about showcase and your favorite project have been added!. Thank you and Goodbye`);
      })
      .catch(err => {
        console.error(err);
      });
  },

  

  'AMAZON.HelpIntent'() {
    const speechOutput = instructions;
    const reprompt = instructions;
    this.emit(':ask', speechOutput, reprompt);
  },

  'AMAZON.CancelIntent'() {
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.StopIntent'() {
    this.emit(':tell', 'Goodbye!');
  }
};

exports.handler = function handler(event, context) {
  const alexa = alexaSDK.handler(event, context);
  alexa.APP_ID = appId;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
