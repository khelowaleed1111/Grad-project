const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar, handleMulterError } = require('../middleware/uploadMiddleware');

// Validation middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .toLowerCase(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('role')
    .optional()
    .isIn(['buyer', 'owner', 'agent'])
    .withMessage('Role must be buyer, owner, or agent'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .toLowerCase(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

// Routes

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 * @validation Required: name, email, password
 * @validation Optional: phone, role
 */
router.post('/register', registerValidation, handleValidationErrors, register);

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 * @validation Required: email, password
 */
router.post('/login', loginValidation, handleValidationErrors, login);

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (JWT required)
 */
router.get('/me', protect, getMe);

/**
 * @desc    Update user profile (name, phone, avatar)
 * @route   PUT /api/auth/update-profile
 * @access  Private (JWT required)
 * @validation Optional: name, phone
 * @file    Optional: avatar (image file)
 */
router.put(
  '/update-profile',
  protect,
  uploadAvatar,
  handleMulterError,
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private (JWT required)
 * @validation Required: currentPassword, newPassword
 */
router.put(
  '/change-password',
  protect,
  changePasswordValidation,
  handleValidationErrors,
  changePassword
);

module.exports = router;
