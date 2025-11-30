const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SustainabilityData = sequelize.define('SustainabilityData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  metric_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Metric name cannot be empty'
      }
    }
  },
  metric_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Metric value must be a valid number'
      }
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Invalid date format'
      }
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Category cannot be empty'
      },
      isIn: {
        args: [['Carbon', 'Water', 'Energy', 'Waste', 'Other']],
        msg: 'Category must be one of: Carbon, Water, Energy, Waste, Other'
      }
    }
  }
}, {
  tableName: 'sustainability_data',
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['date']
    },
    {
      fields: ['metric_name']
    }
  ]
});

module.exports = SustainabilityData;