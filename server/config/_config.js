"use strict"

require('dotenv').config();

var ids = {
  github: {
    clientID: process.env.GITHUBCLIENT,
    clientSecret: process.env.GITHUBSECRET,
    callbackURL: process.env.GITHUBCALLBACK
  },
  linkedin: {
    clientID: process.env.LINKEDINCLIENT,
    clientSecret: process.env.LINKEDINSECRET,
    callbackURL: process.env.LINKEDINCALLBACK
  },
  twitter: {
    consumerKey: process.env.TWITTERKEY,
    consumerSecret: process.env.TWITTERSECRET,
    callbackURL: process.env.TWITTERCALLBACK
  },
    facebook: {
    clientID: process.env.FACEBOOKCLIENT,
    clientSecret: process.env.FACEBOOKSECRET,
    callbackURL: process.env.FACEBOOKCALLBACK
  },
    google: {
    clientID: process.env.GOOGLECLIENT,
    clientSecret: process.env.GOOGLESECRET,
    callbackURL: process.env.GOOGLECALLBACK
  }
};

module.exports = ids;