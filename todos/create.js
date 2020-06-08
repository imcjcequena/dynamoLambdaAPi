"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
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

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      country: country,
      site: site,
      requestId: requestId,
      name: name,
      accessDate: accessDate,
      status: status,
      bodyTemp: bodyTemp,
      spo2: spo2,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
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
      body: JSON.stringify({
        success: "True",
      }),
    };
    callback(null, response);
  });
};
