const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
