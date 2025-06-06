const Charities = require('../models/Charities');
const donation = require('../models/donation');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const sendEmail=require('../utils/sendemail');
const User=require('../models/User');

const registerCharity = async (req, res) => {
  const { name, description, goal_amount, category, location } = req.body;

  try {
    if (req.user.user_type !== 'charity') {
      return res.status(403).json({ message: 'Only charity users can register a charity profile.' });
    }

    const charity = await Charities.create({
      name,
      description,
      goal_amount,
      category,
      location,
      userId: req.user.id,
    });

    res.status(201).json({ message: 'Charity registered successfully', charity });
  } catch (err) {
    res.status(500).json({ message: 'Error registering charity', error: err.message });
  }
};

const approveCharity = async (req, res) => {
  const { id } = req.params;
  try {
    const charity = await Charities.findByPk(id,{
      include: [{ model: User, attributes: ['email'] }]
    });

    if (!charity) return res.status(404).json({ message: 'Charity not found' });

    charity.isApproved = true;
    await charity.save();
    console.log(charity.User.email,charity.name);
    if(charity.User&&charity.User.email){
     await sendEmail(
      charity.User.email,
      'Charity Approved ',
      `<h2>Hi ${charity.name},</h2><p>Your charity has been <strong>approved</strong> and is now live on the platform. You can now start receiving donations!</p><p>Thank you for being a force for good! </p>`
    );
    }
    res.json({ message: 'Charity approved and mail sent' });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed' });
  }
};

const rejectCharity = async (req, res) => {
  const { id } = req.params;
  try {
    const charity = await Charities.findByPk(id);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });

    await charity.destroy();
    res.json({ message: 'Charity rejected!' });
  } catch (err) {
    res.status(500).json({ message: 'Rejection failed' });
  }
};
const getPendingCharities = async (req, res) => {
  try {
    const charities = await Charities.findAll({
  where: { isApproved: false },
});

    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending charities' });
  }
};

const getApprovedCharities = async (req, res) => {
  try {
    const { name, category, location } = req.query;
    const filters = {
      isApproved: true
    };
    if (name) filters.name = { [Op.like]: `%${name.toLowerCase()}%` };
    if (category) filters.category = { [Op.like]: `%${category.toLowerCase()}%` };
    if (location) filters.location = { [Op.like]: `%${location.toLowerCase()}%` };
    const charities = await Charities.findAll({ where: filters });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch approved charities' });
    console.log(err.message);
  }
};
const getDonationSummary = async (req, res) => {
  try {
    const charities = await Charities.findAll({
      where: { isApproved: true },
      attributes: [
        'id',
        'name',
        'description',
        'goal_amount',
        'category',
        'location',
        [Sequelize.fn('SUM', Sequelize.col('donations.amount')), 'totalDonated']
      ],
      include: [
        {
          model: donation,
          attributes: [],
          where: { status: 'SUCCESS' },
          required: false,
        }
      ],
      group: ['Charities.id'],
      raw: true,
    });

    const result = charities.map(charity => ({
      id: charity.id,
      name: charity.name,
      description: charity.description,
      goal_amount: charity.goal_amount,
      category: charity.category,
      location: charity.location,
      totalDonated: charity.totalDonated || 0,
      progress: charity.goal_amount > 0
        ? ((charity.totalDonated || 0) / charity.goal_amount) * 100
        : 0
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donation summary' });
  }
};


    


module.exports = {
  registerCharity,
  approveCharity,
  rejectCharity,
  getPendingCharities,
  getApprovedCharities,
  getDonationSummary
};
