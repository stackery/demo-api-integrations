const AWS = require('aws-sdk');
const ses = new AWS.SES();

exports.handler = async message => {
  console.log(message);

  try {
    const { to, subject, body } = validateParameters(message.body);

    await ses.sendEmail({
      Source: 'demo@stackery.io',
      Destination: {
        ToAddresses: [ to ]
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Text: { Data: body }
        }
      }
    }).promise();

    return {
      statusCode: 204
    };
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      return {
        statusCode: 500,
        body: `${err.message} (${err.code})`
      };
    }
  }
}

function validateParameters (rawBody) {
  function error(message) {
    const err = new Error(`Invalid Request: ${message}`);

    err.response = {
      statusCode: 400,
      body: `Invalid Request: ${message}`
    };

    throw err;
  }

  if (!rawBody) {
    error('Missing request body');
  }

  let body;
  try {
    body = JSON.parse(rawBody)
  } catch (err) {
    error('Request body must be valid JSON');
  }

  if (typeof body.to !== 'string') {
    error('`to` must be an email address');
  }

  if (typeof body.subject !== 'string') {
    error('`subject` must be a string');
  }

  if (typeof body.body !== 'string') {
    error('`body` must be a string');
  }

  return ({ to, subject, body } = body);
}