// Mock Email Service - logs to console (replace with real service for production)
class EmailService {
  constructor() {
    this.emails = []; // Store sent emails for demo purposes
  }

  async sendEmail({ to, subject, html, text }) {
    const email = {
      id: Date.now(),
      to,
      subject,
      html,
      text,
      sentAt: new Date()
    };
    
    // Store for demo
    this.emails.push(email);
    
    // Log to console (in production, this would send via SendGrid, AWS SES, etc.)
    console.log('========================================');
    console.log('📧 EMAIL SENT');
    console.log('========================================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('----------------------------------------');
    console.log(text || html);
    console.log('========================================\n');
    
    return { success: true, messageId: email.id };
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

  // Application received notification to employer
  async sendNewApplicationNotification(employerEmail, applicantName, jobTitle) {
    return this.sendEmail({
      to: employerEmail,
      subject: `New Application - ${jobTitle}`,
      html: `
        <h2>Hello,</h2>
        <p>You have received a new application for <strong>${jobTitle}</strong>.</p>
        <p>Applicant: <strong>${applicantName}</strong></p>
        <p>Please log in to your dashboard to review the application.</p>
        <br>
        <p>Best regards,<br>EthioJobFinder Team</p>
      `,
      text: `Hello,\n\nYou have received a new application for ${jobTitle}.\n\nApplicant: ${applicantName}\n\nPlease log in to your dashboard to review the application.\n\nBest regards,\nEthioJobFinder Team`
    });
  }

  // Application status update to job seeker
  async sendApplicationStatusUpdate(userEmail, userName, jobTitle, status, notes) {
    const statusMessages = {
      pending: 'is pending review',
      reviewed: 'has been reviewed',
      shortlisted: 'you have been shortlisted',
      accepted: 'you have been accepted',
      rejected: 'unfortunately, you were not selected'
    };
    
    return this.sendEmail({
      to: userEmail,
      subject: `Application Update - ${jobTitle}`,
      html: `
        <h2>Hello ${userName},</h2>
        <p>Your application for <strong>${jobTitle}</strong> ${statusMessages[status]}.</p>
        ${notes ? `<p><strong>Employer Notes:</strong> ${notes}</p>` : ''}
        <p>Status: <strong>${status.toUpperCase()}</strong></p>
        <br>
        <p>Best regards,<br>EthioJobFinder Team</p>
      `,
      text: `Hello ${userName},\n\nYour application for ${jobTitle} ${statusMessages[status]}.\n\n${notes ? `Employer Notes: ${notes}\n\n` : ''}Status: ${status.toUpperCase()}\n\nBest regards,\nEthioJobFinder Team`
    });
  }

  // Job alert notification
  async sendJobAlert(userEmail, userName, jobs) {
    const jobListings = jobs.map(job => `
      <li>
        <strong>${job.title}</strong> at ${job.company} - ${job.location}<br>
        <a href="http://localhost:3000/jobs/${job._id}">View Job</a>
      </li>
    `).join('');

    return this.sendEmail({
      to: userEmail,
      subject: 'New Jobs Matching Your Preferences',
      html: `
        <h2>Hello ${userName},</h2>
        <p>We found ${jobs.length} new job(s) that match your preferences:</p>
        <ul>${jobListings}</ul>
        <p>Apply now before these opportunities are gone!</p>
        <br>
        <p>Best regards,<br>EthioJobFinder Team</p>
      `,
      text: `Hello ${userName},\n\nWe found ${jobs.length} new job(s) that match your preferences:\n\n${jobs.map(j => `- ${j.title} at ${j.company} (${j.location})`).join('\n')}\n\nApply now before these opportunities are gone!\n\nBest regards,\nEthioJobFinder Team`
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
        <h2>Welcome to EthioJobFinder, ${userName}!</h2>
        <p>Thank you for joining Ethiopia's premier job platform.</p>
        <p>${roleMessage}</p>
        <p>Get started by completing your profile and exploring opportunities.</p>
        <br>
        <p>Best regards,<br>EthioJobFinder Team</p>
      `,
      text: `Welcome to EthioJobFinder, ${userName}!\n\nThank you for joining Ethiopia's premier job platform.\n\n${roleMessage}\n\nGet started by completing your profile and exploring opportunities.\n\nBest regards,\nEthioJobFinder Team`
    });
  }

  // Email verification
  async sendVerificationEmail(userEmail, userName, verificationToken) {
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
    return this.sendEmail({
      to: userEmail,
      subject: 'Verify Your Email - EthioJobFinder',
      html: `
        <h2>Welcome to EthioJobFinder, ${userName}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #f97316, #ec4899); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Verify Email</a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>This link expires in 24 hours.</p>
      `,
      text: `Welcome ${userName}! Please verify your email: ${verificationUrl}`
    });
  }

  // Password reset
  async sendPasswordReset(userEmail, resetToken) {
    return this.sendEmail({
      to: userEmail,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Use this token to reset your password:</p>
        <p><strong>${resetToken}</strong></p>
        <p>This token expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br>EthioJobFinder Team</p>
      `,
      text: `Password Reset\n\nYou requested a password reset. Use this token to reset your password:\n\n${resetToken}\n\nThis token expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nEthioJobFinder Team`
    });
  }

  // Get sent emails (for admin/demo purposes)
  getSentEmails() {
    return this.emails;
  }
}

module.exports = new EmailService();
