const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');

// User routes (protected)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('avatar'), updateProfile);
router.put('/change-password', auth, changePassword);
router.post('/address', auth, addAddress);
router.put('/address/:addressId', auth, updateAddress);
router.delete('/address/:addressId', auth, deleteAddress);

// Admin routes
router.get('/', auth, admin, getAllUsers);
router.delete('/:id', auth, admin, deleteUser);

module.exports = router;
