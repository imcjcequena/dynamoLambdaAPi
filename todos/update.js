"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const {
    country,
    site,
    requestId,
    name,
    accessDate,
    status,
    bodyTemp,
    spo2,
  } = JSON.parse(event.body);

  // validation

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      name: event.pathParameters.name,
    },

    ExpressionAttributeNames: {
      "#status": "status",
    },

    ExpressionAttributeValues: {
      ":country": country,
      ":site": site,
      ":requestId": requestId,
      ":status": status,
      ":bodyTemp": bodyTemp,
      ":spo2": spo2,
      ":createdAt": timestamp,
      ":updatedAt": timestamp,
    },
    UpdateExpression:
      "SET #status = :status,  country = :country, site = :site, requestId = :requestId, bodyTemp = :bodyTemp, spo2 = :spo2, createdAt = :createdAt, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW",
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todo item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
