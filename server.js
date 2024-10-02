const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Dialogflow Setup
const sessionClient = new dialogflow.SessionsClient();
const projectId = 'flash-yen-436906-m0'; // Replace with your Dialogflow project ID

// Route to handle messages from the Flutter app
app.post('/send-message', async (req, res) => {
  const { message, sessionId } = req.body;

  // Create a unique session ID for each user (use sessionId from Flutter frontend)
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // The text query request
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };

  try {
    // Send request to Dialogflow
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Respond with the chatbot's reply
    res.send({
      reply: result.fulfillmentText,
    });
  } catch (error) {
    console.error('Dialogflow API Error:', error);
    res.status(500).send('Error processing request');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
