const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceipt = (donation, charity, user) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '..', 'public', 'receipts', `receipt-${donation.id}.pdf`);
        const doc = new PDFDocument();
        const stream=fs.createWriteStream(filePath)
        doc.pipe(stream);

        doc.fontSize(18).text('Donation Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Receipt ID: ${donation.id}`);
        doc.text(`Donor Name: ${user.name || user.email}`);
        doc.text(`Charity: ${charity.name}`);
        doc.text(`Amount Donated: ₹${donation.amount}`);
        doc.text(`Date: ${donation.createdAt.toDateString()}`);
        doc.text(`Status: ${donation.status}`);
        doc.moveDown();
        doc.text(`Thank you for your generous contribution!`);

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    })

};

module.exports = generateReceipt;
