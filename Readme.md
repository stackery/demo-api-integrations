### Simple API Using API Gateway Integrations

This single-file project deploys a complete API through AWS API Gateway. The API is capable of getting, putting, and deleting records from a DynamoDB table and sending emails using Simple Email Service (SES).

#### PUT /records/{id}
Saves a record in the DynamoDB table. Overwrites existing records.

Request Body: Arbitrary JSON object

Response Body: `{}`

#### GET /records/{id}
Get a record from the DynamoDB table. Returns the values of the record:

Response Body: JSON object with values from record

#### DELETE /records/{id}
Deletes a record from the DynamoDB table.

Response Body: `{}`

#### POST /email
Sends an email from `demo@stackery.io` (you'll need to change this to an email you have verified in SES before deploying)

Request Body:
```JSON
{
  "to": "<recipient>",
  "subject": "<subject>",
  "body": "<body>"
}
```
Response Body:
```JSON
{
  "SendEmailResponse": {
    "ResponseMetadata": {
      "RequestId": "<request ID>"
    },
    "SendEmailResult": {
      "MessageId": "<message ID>"
    }
  }
}
```