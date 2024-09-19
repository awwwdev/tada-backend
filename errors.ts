const ERRORS = {
  USER_NOT_FOUND: {
    code: 404,
    message: 'User not found',
  },
  EMAIL_ALREADY_EXISTS: {
    code: 409,
    message: 'Email already exists',
  },
  INVALID_CREDENTIALS: {
    code: 401,
    message: 'Invalid credentials',
  },
  INVALID_TOKEN: {
    code: 401,
    message: 'Invalid token',
  },
  TOKEN_EXPIRED: {
    code: 401,
    message: 'Token expired',
  },
  EMAIL_NOT_FOUND: {
    code: 404,
    message: 'Email not found',
  },
  PASSWORD_NOT_MATCH: {
    code: 400,
    message: 'Password not match',
  },
  USER_ALREADY_EXISTS: {
    code: 409,
    message: 'User already exists',
  },
  NOT_AUTHENTICATED: {
    code: 401,
    message: 'Not authenticated',
  },
};

export default ERRORS;
