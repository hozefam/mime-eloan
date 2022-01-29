const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("config");
// const db = require("./database");
const logger = require("./logger").logger;
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.cpKey);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.tokenKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            try {
                //decrypts userId

                let user = jwt_payload;
                //checks in database
                // let query = "select * from users where user_id=" + user.userId;
                // db.connection.query(query, (err, rows) => {
                //   if (err) {
                //     logger.error("Passport authentication mysql error: " + err);
                //     return done(null, false);
                //   } else if (rows && rows.length > 0) {
                //     return done(null, user);
                //   } else {
                //     logger.error("Passport authentication unknown error");
                //     return done(null, false);
                //   }
                // });
                const decryptedUserId = cryptr.decrypt(user.userId);
                // console.log(user.userId);
                if (decryptedUserId > 0) {
                    return done(null, user);
                } else {
                    logger.error("Passport authentication unknown error");
                    return done(null, false);
                }
            } catch (err) {
                logger.error("Passport Authentication error: " + err);
                return done(null, false);
            }
        })
    );
};