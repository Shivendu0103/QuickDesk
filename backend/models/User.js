const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'agent', 'admin'),
    defaultValue: 'user'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Password hashing before save
User.beforeCreate(async (user) => {
  if (user.password_hash) {
    user.password_hash = await bcrypt.hash(user.password_hash, 12);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password_hash')) {
    user.password_hash = await bcrypt.hash(user.password_hash, 12);
  }
});

// Instance method to check password
User.prototype.checkPassword = async function(password) {
  return bcrypt.compare(password, this.password_hash);
};

// Instance method to get safe user data
User.prototype.getSafeData = function() {
  const { password_hash, ...safeData } = this.toJSON();
  return safeData;
};

module.exports = User;
