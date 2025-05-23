const Razorpay = require('razorpay');

const donation = require('../models/donation');
const Charities = require('../models/Charities');
const User = require('../models/User');

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createDonationOrder = async (req, res) => {
    const { amount, charityId } = req.body;

    try {
        const charity = await Charities.findByPk(charityId);
        if (!charity || !charity.isApproved) {
            return res.status(404).json({ message: 'Charity not found or not approved' });
        }

        const order = await rzp.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_donation_${Date.now()}`
        });

        await donation.create({
            amount,
            CharityId: charityId,
            UserId: req.user.id,
            orderId: order.id,
        });

        res.json({ order });
    } catch (err) {
        res.status(500).json({ message: 'Error creating donation order', error: err.message });
    }
};

const verifyDonation = async (req, res) => {
    const { orderId, paymentId, status } = req.body;

    try {
        const Donation = await donation.findOne({ where: { orderId } });

        if (!Donation) {
            return res.status(404).json({ message: 'Donation record not found' });
        }

        Donation.paymentId = paymentId;
        Donation.status = status === 'success' ? 'SUCCESS' : 'FAILED';
        await Donation.save();

        res.json({ message: 'Donation status updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating donation status', error: err.message });
    }
};

const userHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const donationHistory = await donation.findAll({
            where: { userId,status:'success' }, 
            include: [{
                model: Charities, 
                attributes: ['id', 'name',] 
            }],
            order: [['createdAt', 'DESC']] 
        });
        res.json(donationHistory);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Failed to fetch donation history', });
    }
}

module.exports = {
    createDonationOrder,
    verifyDonation,
    userHistory
};
