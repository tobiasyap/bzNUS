const passport = require('passport');
const NusStrategy = require('passport-nus-openid').Strategy;

const User = require('../models/User');

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
            realm: 'http://localhost:3000/',
            profile: true
        },
        async (identifier, done) => {
            console.log('now in verify callback');
            try {
                const user = await User.findByNusnetID(identifier);
                if(!user) {
                    done(null, false, { message: 'User is unregistered' });
                }
                done(null, user); // User exists. Attach it to passport
            }
            catch(err) {
                done(err); // Database exception
            }
        }
    ));
};
