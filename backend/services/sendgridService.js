const sgMail = require('@sendgrid/mail');

class SendGridService {
  constructor() {
    // Set API key from environment variable
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@ethiojobfinder.com';
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const msg = {
        to,
        from: this.fromEmail,
        subject,
        text,
        html,
      };

      const response = await sgMail.send(msg);
      console.log('📧 Email sent successfully to:', to);
      return { success: true, messageId: response[0].messageId };
    } catch (error) {
      console.error('❌ SendGrid Error:', error.message);
      throw error;
    }
  }

  // Application confirmation to job seeker
  async sendApplicationConfirmation(userEmail, userName, jobTitle, companyName) {
    return this.sendEmail({
      to: userEmail,
      subject: `Application Submitted - ${jobTitle}`,
      html: `
        <h2>Hello ${userName},</h2>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted!</p>
        <p>The employer will review your application and contact you if there's a match.</p>
        <p>Good luck with your job search!</p>
        <br>
        <p>Best regards,<br>EthioJobFinder Team</p>
      `,
      text: `Hello ${userName},\n\nYour application for ${jobTitle} at ${companyName} has been successfully submitted!\n\nThe employer will review your application and contact you if there's a match.\n\nGood luck with your job search!\n\nBest regards,\nEthioJobFinder Team`
    });
  }

  // Email verification
  async sendVerificationEmail(userEmail, userName, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    return this.sendEmail({
      to: userEmail,
      subject: 'Verify Your Email - EthioJobFinder',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #f97316;">Welcome to EthioJobFinder, ${userName}!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f97316, #ec4899); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Verify Email</a>
          <p style="color: #666;">Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
          <p style="color: #666;">This link expires in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
      text: `Welcome ${userName}! Please verify your email: ${verificationUrl}`
    });
  }

  // Password reset
  async sendPasswordReset(userEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    return this.sendEmail({
      to: userEmail,
      subject: 'Password Reset Request - EthioJobFinder',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #f97316;">Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f97316, #ec4899); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
          <p style="color: #666;">Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color: #666;">This link expires in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
      text: `Password Reset\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`
    });
  }

  // Welcome email
  async sendWelcomeEmail(userEmail, userName, role) {
    const roleMessage = role === 'employer' 
      ? 'You can now post job openings and find qualified candidates.'
      : 'You can now browse and apply for jobs that match your skills.';

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to EthioJobFinder!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #f97316;">Welcome to EthioJobFinder, ${userName}!</h2>
          <p>Thank you for joining Ethiopia's premier job platform.</p>
          <p>${roleMessage}</p>
          <p>Get started by completing your profile and exploring opportunities.</p>
          <br>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f97316, #ec4899); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Complete Your Profile</a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">EthioJobFinder - Connecting Ethiopian talent with opportunities</p>
        </div>
      `,
      text: `Welcome to EthioJobFinder, ${userName}!\n\nThank you for joining Ethiopia's premier job platform.\n\n${roleMessage}\n\nGet started by completing your profile and exploring opportunities.\n\nBest regards,\nEthioJobFinder Team`
    });
  }
}

module.exports = new SendGridService();
