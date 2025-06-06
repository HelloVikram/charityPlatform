const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendEmail = async (to, subject, htmlContent) => {
  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    email: process.env.BREVO_FROM_EMAIL,
    name: 'Charity Platform'
  };

  const receivers = [{ email: to }];

  try {
    await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      htmlContent,
    });
    console.log(' Email sent to:', to);
  } catch (err) {
    console.error(' Email failed:', err.response?.body || err);
  }
};

module.exports = sendEmail;
