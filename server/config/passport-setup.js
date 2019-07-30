const OpenIdStrategy = require("@passport-next/passport-openid").Strategy;
const pgp = require('pg-promise');

const util = require("util");
const User = require("../models/User");

function makeEnvURL(url) {
  if(process.env.NODE_ENV === "production") return process.env.ROOT_URL + url;
  return "http://localhost:5000" + url;
}

function NusStrategy(options, validate) {
  options = options || {};
  options.providerURL = options.providerURL || "https://openid.nus.edu.sg/";
  options.profile = options.profile === undefined ? true : options.profile;

  OpenIdStrategy.call(this, options, validate);
  this.name = "nus-openid";
}

util.inherits(NusStrategy, OpenIdStrategy);

module.exports = passport => {
  // Tell passport how to serialize the user so session can be stored via cookie
  passport.serializeUser((user, done) => {
    done(null, user.user_id); // Use user_id to uniquely identify the user
  });

  passport.deserializeUser(async (user_id, done) => {
    try {
      const user = await User.findByUserID(user_id);
      // Sucessfully retrieved user
      // Now return it to passport to maintain the session
      done(null, user);
    } catch (err) {
      done(err, false); // Database error
    }
  });

  passport.use(
    new NusStrategy(
      {
        returnURL: makeEnvURL("/auth/nus/return"),
        realm: makeEnvURL("/"),
        profile: true
      },
      async (identifier, profile, done) => {
        console.log(`Verifying. Received profile ${profile}`);

        try {
          try {
            const user = await User.findByNusnetID(identifier);
            return done(null, user); // User exists. Attach it to passport
          }
          catch(err) {
            if(err.code === pgp.errors.queryResultErrorCode.noData) {
              // User does not exist in database yet.
              user = {
                nusnet_id: identifier,
                fullname: profile.displayName,
                email: profile.emails === [] ? null : profile.emails[0].value
              };
              user = await User.insert(user);
              return done(null, user, {
                message: `Registered new NUSNET ID ${user.nusnet_id}`
              });
            }
            else {
              throw err;
            }
          }
        } catch (err) {
          console.error("Error accessing database!");
          console.error(err);
          return done(err); // Database exception
        }
      }
    )
  );
};
