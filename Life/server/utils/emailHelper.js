const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an OTP email to a new donor.
 */
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your LifeLink Verification Code',
    text: `Welcome to LifeLink! Your One-Time Password (OTP) is: ${otp}\nThis code will expire in 10 minutes.`,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Welcome to LifeLink!</h2>
      <p>Thank you for registering as a donor. Your One-Time Password (OTP) is:</p>
      <h1 style="font-size: 36px; letter-spacing: 2px; color: #16A34A;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error);
    return false;
  }
};

/**
 * Sends an alert email to a matched donor.
 */
const sendAlertEmail = async (donor, patient) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: donor.email,
    subject: `URGENT: LifeLink Blood Donation Request from ${patient.name}`,
    text: `Dear ${donor.name},\n\nA patient, ${patient.name}, urgently needs your blood type (${patient.bloodType}).\n
           They are located at: ${patient.location.name}.\n
           Patient Contact: ${patient.phone}\n\n
           Please respond if you are available to help.
           \nThank you for being a lifeline!`,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>URGENT: LifeLink Donation Request</h2>
      <p>Dear ${donor.name},</p>
      <p>A patient, <strong>${patient.name}</strong>, urgently needs your blood type (<strong>${patient.bloodType}</strong>).</p>
      <p>Your profile was matched based on compatibility and proximity.</p>
      <hr>
      <p><strong>Patient Details:</strong></p>
      <ul>
        <li><strong>Location:</strong> ${patient.location.name}</li>
        <li><strong>Contact:</strong> ${patient.phone}</li>
        <li><strong>Urgency:</strong> ${patient.urgency}</li>
      </ul>
      <hr>
      <p>If you are available to help, please contact the patient or associated hospital immediately.</p>
      <p>Thank you for being a lifeline!</p>
    </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to donor ${donor.email} for patient ${patient.name}`);
    return true;
  } catch (error) {
    console.error(`Failed to send alert email:`, error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendAlertEmail,
};