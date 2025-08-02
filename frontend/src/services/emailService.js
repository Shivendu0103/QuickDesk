const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,   // e.g. smtp.gmail.com
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,                   // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendTicketNotification(ticket, event) {
  try {
    // Customize message based on event (created or status changed)
    let subject = '';
    let message = '';
    if (event === 'created') {
      subject = `New Ticket Created: ${ticket.subject}`;
      message = `A new ticket has been created:\n\nSubject: ${ticket.subject}\nDescription: ${ticket.description}\n\nPlease check QuickDesk to handle it.`;
    } else if (event === 'status_updated') {
      subject = `Ticket Status Updated: ${ticket.subject}`;
      message = `The status of your ticket "${ticket.subject}" has been updated to: ${ticket.status}.`;
    }

    // Send mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ticket.creator.email,   // send to ticket creator
      subject,
      text: message,
    });

    console.log(`Email notification sent for ticket ${ticket.id} event: ${event}`);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

module.exports = { sendTicketNotification };
