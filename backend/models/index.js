const User = require('./User');
const Ticket = require('./Ticket');
const Category = require('./Category');
const Comment = require('./Comment');

// Define associations
User.hasMany(Ticket, { foreignKey: 'user_id', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

User.hasMany(Ticket, { foreignKey: 'assigned_to', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Category.hasMany(Ticket, { foreignKey: 'category_id', as: 'tickets' });
Ticket.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Ticket.hasMany(Comment, { foreignKey: 'ticket_id', as: 'comments' });
Comment.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });

User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = {
  User,
  Ticket,
  Category,
  Comment
};
