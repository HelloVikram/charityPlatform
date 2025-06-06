const generateReceipt = require('../utils/receipt');
const Donation = require('../models/donation');
const Charities = require('../models/Charities');
const User = require('../models/User');

const downloadReceipt = async (req, res) => {
  try {
    const donationId = req.params.id;

    const donation = await Donation.findByPk(donationId, {
      include: [
        {
          model: Charities,
          attributes: ['id', 'name', 'location', 'category']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!donation || donation.status !== 'SUCCESS') {
      return res.status(404).json({ message: 'Valid donation not found' });
    }

    const filePath =await generateReceipt(donation, donation.Charity, donation.User);
    const fileName = `receipt-${donation.id}.pdf`;

    res.download(filePath, fileName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate receipt' });
  }
};

module.exports = { downloadReceipt };
