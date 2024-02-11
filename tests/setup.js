const mongoose = require("mongoose");
const keys = require("../config/keys");

jest.setTimeout(10000); // wait 10 sec max for every test
require("../models/User");

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

afterAll(async () => {
  await mongoose.disconnect();
});
