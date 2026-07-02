// Regular expression for standard email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password constraints: 8-16 characters, 1 uppercase letter, 1 special character
const validatePasswordStr = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  // Matches non-alphanumeric characters as special characters
  if (!/[!@#$%^&*(),.?":{}|<>_#\-\+\=\[\]\/\\]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  return null;
};

const validateRegister = (req, res, next) => {
  const { name, email, address, password, role } = req.body;
  const targetRole = role || 'Normal User';

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  // Address is only required for Store Owners (Cafes)
  if (targetRole === 'Store Owner' && (!address || address.trim().length === 0)) {
    return res.status(400).json({ message: 'Store Address is required for Cafe Owners.' });
  }

  const pwdError = validatePasswordStr(password);
  if (pwdError) {
    return res.status(400).json({ message: pwdError });
  }

  next();
};

const validateUserCreate = (req, res, next) => {
  const { name, email, address, password, role } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  // Address is only required for Store Owners
  if (role === 'Store Owner' && (!address || address.trim().length === 0)) {
    return res.status(400).json({ message: 'Address is required for Store Owner.' });
  }

  const pwdError = validatePasswordStr(password);
  if (pwdError) {
    return res.status(400).json({ message: pwdError });
  }

  const allowedRoles = ['System Administrator', 'Normal User', 'Store Owner'];
  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid user role selected.' });
  }

  next();
};

const validatePasswordUpdate = (req, res, next) => {
  const { password } = req.body;
  const pwdError = validatePasswordStr(password);
  if (pwdError) {
    return res.status(400).json({ message: pwdError });
  }
  next();
};

module.exports = {
  validateRegister,
  validateUserCreate,
  validatePasswordUpdate,
};
