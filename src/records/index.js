const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async message => {
  console.log(message);

  try {
    const recordId = message.pathParameters.id;
    switch (message.httpMethod) {
      case 'GET':
        return getRecord(recordId);

      case 'PUT':
        let body;
        try {
          body = JSON.parse(message.body)
        } catch (err) {
          return {
            statusCode: 400,
            body: 'Request body must be valid JSON'
          }
        }

      return putRecord(recordId, body);

      case 'DELETE':
        return deleteRecord(recordId)

      default:
        return {
          statusCode: 405,
          body: `Invalid HTTP method ${message.httpMethod}`
        };
    }
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

async function getRecord (id) {
  const { Item } = await ddb.get({
    TableName: process.env.TABLE_NAME,
    Key: { id }
  }).promise();

  if (!Item) {
    return {
      statusCode: 404,
      body: `Record ${id} does not exist`
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(Item, null, 200),
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

async function putRecord (id, attributes) {
  await ddb.put({
    TableName: process.env.TABLE_NAME,
    Item: {
      ...attributes,
      id
    }
  }).promise();

  return {
    statusCode: 204
  };
}

async function deleteRecord (id) {
  await ddb.delete({
    TableName: process.env.TABLE_NAME,
    Key: { id }
  }).promise();

  return {
    statusCode: 204
  };
}