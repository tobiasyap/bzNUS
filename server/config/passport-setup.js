const passport = require('@passport-next/passport');
const openid = require('@passport-next/passport-openid');
const OpenIdStrategy = require('@passport-next/passport-openid').Strategy;
const util = require('util');

const User = require('../models/User');

function NusStrategy(options, validate) {
    options = options || {};
    options.providerURL = options.providerURL || 'https://openid.nus.edu.sg/';
    options.profile =  (options.profile === undefined) ? true : options.profile;
    
    OpenIdStrategy.call(this, options, validate);
    this.name = 'nus-openid';
}

util.inherits(NusStrategy, OpenIdStrategy);

module.exports = (passport) => {
    // Tell passport how to serialize the user so session can be stored via cookie
    passport.serializeUser((user, done) => {
        done(null, user.username); // Use username to uniquely identify the user
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByUsername(id);
            // Sucessfully retrieved user
            // Now return it to passport to maintain the session
            done(null, user);
        }
        catch(err) {
            done(err, false); // Database error
        }
    })

    passport.use(new NusStrategy({
            returnURL: 'http://localhost:5000/auth/nus/return',
            realm: 'http://localhost:5000/',
            profile: true,
        },
        async (identifier, profile, done) => {
            console.log('now in verify callback');
            console.log('done: ', done);
            try {
                const user = await User.findByNusnetID(identifier);
                if(!user) {
                    return done(null, false, { message: 'User is unregistered' });
                }
                return done(null, user); // User exists. Attach it to passport
            }
            catch(err) {
                console.error(err);
                return done(err); // Database exception
            }
        }
    ));
};
