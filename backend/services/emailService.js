const nodemailer = require('nodemailer');
require('dotenv').config();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates
const getEmailTemplate = (ticket, eventType, comment = null) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const ticketUrl = `${baseUrl}/tickets/${ticket.id}`;
  
  switch (eventType) {
    case 'created':
      return {
        subject: `🎫 New Support Ticket Created - ${ticket.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">🎫 QuickDesk</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">New Support Ticket Created</p>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0;">Ticket Details</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Subject:</strong> ${ticket.subject}</p>
                <p><strong>Priority:</strong> <span style="color: ${getPriorityColor(ticket.priority)}; font-weight: bold;">${ticket.priority.toUpperCase()}</span></p>
                <p><strong>Category:</strong> ${ticket.category?.name || 'General'}</p>
                <p><strong>Created by:</strong> ${ticket.creator?.first_name} ${ticket.creator?.last_name}</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0;">Description:</h3>
                <p style="line-height: 1.6; color: #475569;">${ticket.description}</p>
              </div>
              <div style="text-align: center;">
                <a href="${ticketUrl}" style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Ticket</a>
              </div>
            </div>
            <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center;">
              <p style="margin: 0;">© 2025 QuickDesk Help Desk System</p>
            </div>
          </div>
        `,
        text: `New support ticket created: ${ticket.subject}\n\nPriority: ${ticket.priority}\nCategory: ${ticket.category?.name || 'General'}\n\nDescription: ${ticket.description}\n\nView ticket: ${ticketUrl}`
      };

    case 'status_updated':
      return {
        subject: `📋 Ticket Status Updated - ${ticket.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">🎫 QuickDesk</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Ticket Status Updated</p>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0;">Status Update</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Subject:</strong> ${ticket.subject}</p>
                <p><strong>New Status:</strong> <span style="color: ${getStatusColor(ticket.status)}; font-weight: bold;">${ticket.status.replace('_', ' ').toUpperCase()}</span></p>
                <p><strong>Priority:</strong> <span style="color: ${getPriorityColor(ticket.priority)}; font-weight: bold;">${ticket.priority.toUpperCase()}</span></p>
                ${ticket.assignee ? `<p><strong>Assigned to:</strong> ${ticket.assignee.first_name} ${ticket.assignee.last_name}</p>` : ''}
              </div>
              <div style="text-align: center;">
                <a href="${ticketUrl}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Ticket</a>
              </div>
            </div>
            <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center;">
              <p style="margin: 0;">© 2025 QuickDesk Help Desk System</p>
            </div>
          </div>
        `,
        text: `Your ticket status has been updated!\n\nSubject: ${ticket.subject}\nNew Status: ${ticket.status.replace('_', ' ')}\n\nView ticket: ${ticketUrl}`
      };

    case 'comment_added':
      return {
        subject: `💬 New Comment Added - ${ticket.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ec4899, #db2777); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">🎫 QuickDesk</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">New Comment Added</p>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0;">New Comment</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Subject:</strong> ${ticket.subject}</p>
                <p><strong>Comment by:</strong> ${comment?.author?.first_name} ${comment?.author?.last_name}</p>
                <p><strong>Role:</strong> ${comment?.author?.role}</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0;">Comment:</h3>
                <p style="line-height: 1.6; color: #475569;">${comment?.content}</p>
              </div>
              <div style="text-align: center;">
                <a href="${ticketUrl}" style="background: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Ticket</a>
              </div>
            </div>
            <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center;">
              <p style="margin: 0;">© 2025 QuickDesk Help Desk System</p>
            </div>
          </div>
        `,
        text: `New comment added to your ticket: ${ticket.subject}\n\nComment by: ${comment?.author?.first_name} ${comment?.author?.last_name}\nComment: ${comment?.content}\n\nView ticket: ${ticketUrl}`
      };

    default:
      return {
        subject: `QuickDesk Notification - ${ticket.subject}`,
        html: `<p>Your ticket "${ticket.subject}" has been updated.</p><p><a href="${ticketUrl}">View Ticket</a></p>`,
        text: `Your ticket "${ticket.subject}" has been updated. View ticket: ${ticketUrl}`
      };
  }
};

// Helper functions for colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent': return '#ef4444';
    case 'high': return '#f59e0b';
    case 'medium': return '#3b82f6';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return '#ef4444';
    case 'in_progress': return '#f59e0b';
    case 'resolved': return '#10b981';
    case 'closed': return '#6b7280';
    default: return '#6b7280';
  }
};

// Get notification recipients
const getNotificationRecipients = async (ticket, eventType) => {
  const recipients = [];
  
  // Always notify the ticket creator (unless they're the one making the change)
  if (ticket.creator) {
    recipients.push({
      email: ticket.creator.email,
      name: `${ticket.creator.first_name} ${ticket.creator.last_name}`,
      type: 'creator'
    });
  }

  // For new tickets, notify all agents and admins
  if (eventType === 'created') {
    try {
      const { User } = require('../models');
      const agents = await User.findAll({
        where: {
          role: ['agent', 'admin'],
          is_active: true
        },
        attributes: ['email', 'first_name', 'last_name']
      });

      agents.forEach(agent => {
        recipients.push({
          email: agent.email,
          name: `${agent.first_name} ${agent.last_name}`,
          type: 'agent'
        });
      });
    } catch (error) {
      console.error('Error fetching agents for notification:', error);
    }
  }

  // If ticket is assigned, notify the assignee
  if (ticket.assignee && eventType !== 'created') {
    recipients.push({
      email: ticket.assignee.email,
      name: `${ticket.assignee.first_name} ${ticket.assignee.last_name}`,
      type: 'assignee'
    });
  }

  // Remove duplicates by email
  const uniqueRecipients = recipients.filter((recipient, index, self) =>
    index === self.findIndex(r => r.email === recipient.email)
  );

  return uniqueRecipients;
};

// Main notification function
const sendTicketNotification = async (ticket, eventType, comment = null) => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured, skipping notification');
      return;
    }

    const transporter = createTransporter();
    const emailContent = getEmailTemplate(ticket, eventType, comment);
    const recipients = await getNotificationRecipients(ticket, eventType);

    if (recipients.length === 0) {
      console.log('No recipients found for notification');
      return;
    }

    // Send emails to all recipients
    const emailPromises = recipients.map(async (recipient) => {
      try {
        await transporter.sendMail({
          from: {
            name: 'QuickDesk Support',
            address: process.env.EMAIL_USER
          },
          to: {
            name: recipient.name,
            address: recipient.email
          },
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        console.log(`✅ Email sent to ${recipient.name} (${recipient.email}) for ${eventType}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${recipient.email}:`, error.message);
      }
    });

    await Promise.allSettled(emailPromises);
    console.log(`📧 Notification process completed for ticket ${ticket.id} - ${eventType}`);

  } catch (error) {
    console.error('Email notification service error:', error);
  }
};

// Test email function (for testing purposes)
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email connection failed:', error);
    return false;
  }
};

module.exports = {
  sendTicketNotification,
  testEmailConnection
};
