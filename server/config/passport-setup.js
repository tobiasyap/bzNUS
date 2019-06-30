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
        done(null, user.user_id); // Use user_id to uniquely identify the user
    })

    passport.deserializeUser(async (user_id, done) => {
        try {
            const user = await User.findByUserID(user_id);
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
            console.log('Now in verify callback.');
            console.log(`Received profile ${profile}`);
            try {
                let user = await User.findByNusnetID(identifier);
                if(!user) {
                    user = {
                        nusnet_id: identifier,
                        fullname: profile.displayName,
                        email: profile.emails === [] ? null : profile.emails[0].value
                    };
                    user = await User.insert(user);
                    return done(null, user, { message: `Registered new NUSNET ID ${user.nusnet_id}` });
                }
                return done(null, user); // User exists. Attach it to passport
            }
            catch(err) {
                console.error('Error accessing database!');
                console.error(err);
                return done(err); // Database exception
            }
        }
    ));
};
