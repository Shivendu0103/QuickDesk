const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send ticket notification
const sendTicketNotification = async (ticket, type, comment = null) => {
  try {
    let subject, text, html;

    switch (type) {
      case 'created':
        subject = `New Ticket Created: ${ticket.subject}`;
        text = `A new ticket has been created.\n\nTicket ID: ${ticket.id}\nSubject: ${ticket.subject}\nDescription: ${ticket.description}`;
        html = `
          <h2>New Ticket Created</h2>
          <p><strong>Ticket ID:</strong> ${ticket.id}</p>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Description:</strong> ${ticket.description}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          <p><strong>Created by:</strong> ${ticket.creator?.first_name} ${ticket.creator?.last_name}</p>
        `;
        break;

      case 'status_updated':
        subject = `Ticket Status Updated: ${ticket.subject}`;
        text = `Ticket status has been updated.\n\nTicket ID: ${ticket.id}\nNew Status: ${ticket.status}`;
        html = `
          <h2>Ticket Status Updated</h2>
          <p><strong>Ticket ID:</strong> ${ticket.id}</p>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>New Status:</strong> ${ticket.status}</p>
        `;
        break;

      case 'comment_added':
        subject = `New Comment on Ticket: ${ticket.subject}`;
        text = `A new comment has been added to your ticket.\n\nTicket ID: ${ticket.id}\nComment: ${comment?.content}`;
        html = `
          <h2>New Comment Added</h2>
          <p><strong>Ticket ID:</strong> ${ticket.id}</p>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Comment:</strong> ${comment?.content}</p>
          <p><strong>By:</strong> ${comment?.author?.first_name} ${comment?.author?.last_name}</p>
        `;
        break;
    }

    // For now, we'll just log the email (configure with real email service later)
    console.log('Email notification:', { subject, text });

    // Uncomment when ready to send real emails
    /*
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.creator?.email,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    */

  } catch (error) {
    console.error('Email notification error:', error);
  }
};

module.exports = {
  sendTicketNotification
};
