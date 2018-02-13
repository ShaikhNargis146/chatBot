global["GoogleKey"] = "AIzaSyC2cMB4K6lnmacErJtGEBOJpJoNpZW1JIw";
global["GoogleclientId"] = "1066475903870-l0ro8m9egccg6b67kh2ln9s0fepp292m.apps.googleusercontent.com";
global["GoogleclientSecret"] = "ZyrfJ-TGNZECd0ikCHdaMDxH";

passport.use(new GoogleStrategy({
    clientId: GoogleclientId,
    clientSecret: GoogleclientSecret,
    callbackURL: global["env"].realHost + "/api/user/loginGoogle",
    accessType: "offline"
},
    function (accessToken, refreshToken, profile, cb) {
        profile.googleAccessToken = accessToken;
        profile.googleRefreshToken = refreshToken;
        return cb(profile);
    }
));