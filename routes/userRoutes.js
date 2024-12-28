const express = require('express');
const { getUserById } = require('../controllers/userControllers');

const router = express.Router();

router.get('/:id', getUserById);

module.exports = router;