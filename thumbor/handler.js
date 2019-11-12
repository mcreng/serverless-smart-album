"use strict";

const request = require("request");

module.exports = async (context, callback) => {
  request(`http://localhost:8000/${context}`, null, (err, res) => {
    if (!!err) {
      callback(err, { status: "done" });
    } else {
      callback(res, { status: "done" });
    }
  });
};
