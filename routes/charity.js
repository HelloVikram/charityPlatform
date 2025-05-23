const express = require('express');
const router = express.Router();
const charityController=require('../controllers/charity');
const donationController=require('../controllers/donation');
const authMiddleware=require('../middleware/authMiddleware')
const isAdminMiddleware=require('../middleware/isAdmin');

router.post('/charity/register', authMiddleware.authenticate, charityController.registerCharity);
router.put('/approve/:id', authMiddleware.authenticate, charityController.approveCharity);
router.delete('/reject/:id', authMiddleware.authenticate, charityController.rejectCharity);
router.get('/pending', authMiddleware.authenticate, isAdminMiddleware, charityController.getPendingCharities);
router.get('/approved', charityController.getApprovedCharities);
router.post('/donate', authMiddleware.authenticate, donationController.createDonationOrder);
router.put('/donate/verify', authMiddleware.authenticate, donationController.verifyDonation);
router.get('/donation-summary', charityController.getDonationSummary);
router.get('/user-history', authMiddleware.authenticate, donationController.userHistory);
module.exports=router;