const express = require('express');
const router = express.Router();
const donationController = require('../controllers/receiptdownload');

router.get('/receipt/:id', donationController.downloadReceipt);

module.exports = router;
