const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
// Secret key and token expiration settings for JWT.
const secret = 'super_secret_key';
const expiration = '5h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'Not authenticated.',
    },
  }),
   // Middleware function to authenticate users based on the provided JWT.
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
     // Return a new JWT signed with the secret key and configured to expire.
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
