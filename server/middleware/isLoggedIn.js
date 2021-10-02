var expressJwt = require("express-jwt");

exports.isLoggedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "authentication",
  algorithms: ['sha1', 'RS256', 'HS256']
});
