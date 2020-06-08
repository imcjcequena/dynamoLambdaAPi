"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

module.exports.get = (event, context, callback) => {
  // fetch all todos from the database
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  let from = event.from;
  let to = event.to;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    ProjectionExpression: "accessDate, country",
    KeyConditionExpression: "#accessDate = accessDate between :from and :to",
    ExpressionAttributeNames: {
      "#accessDate": "accessDate",
      "#country": "country",
    },
    ExpressionAttributeValues: {
      ":from": from,
      ":to": to,
      ":#country": country,
    },
  };

  dynamoDb.query(params, (error, data) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the todo item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };
    callback(null, response);
  });
};
