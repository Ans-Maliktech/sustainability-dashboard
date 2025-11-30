const { Op } = require('sequelize');
const sequelize = require('../config/database');
const SustainabilityData = require('../models/SustainabilityData');

// Get all data with optional filters
exports.getAllData = async (req, res) => {
  try {
    const { category, startDate, endDate, limit, offset } = req.query;
    
    let whereClause = {};

    // Filter by category
    if (category) {
      whereClause.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.date[Op.lte] = new Date(endDate);
      }
    }

    const data = await SustainabilityData.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });

    const totalCount = await SustainabilityData.count({ where: whereClause });

    res.json({
      success: true,
      data: data,
      total: totalCount
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data'
    });
  }
};

// Get data by category
exports.getDataByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const data = await SustainabilityData.findAll({
      where: { category },
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      category: category,
      data: data,
      count: data.length
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data by category'
    });
  }
};

// Get aggregated data for charts
exports.getAggregatedData = async (req, res) => {
  try {
    const { groupBy = 'month' } = req.query;

    let dateFormat;
    switch (groupBy) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'year':
        dateFormat = '%Y';
        break;
      default:
        dateFormat = '%Y-%m';
    }

    const aggregatedData = await SustainabilityData.findAll({
      attributes: [
        'category',
        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), dateFormat), 'period'],
        [sequelize.fn('SUM', sequelize.col('metric_value')), 'total_value'],
        [sequelize.fn('AVG', sequelize.col('metric_value')), 'avg_value'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category', 'period'],
      order: [[sequelize.literal('period'), 'ASC']]
    });

    res.json({
      success: true,
      groupBy: groupBy,
      data: aggregatedData
    });

  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error aggregating data'
    });
  }
};

// Get summary statistics
exports.getSummaryStats = async (req, res) => {
  try {
    // Overall statistics
    const totalRecords = await SustainabilityData.count();

    // Statistics by category
    const categoryStats = await SustainabilityData.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('metric_value')), 'total'],
        [sequelize.fn('AVG', sequelize.col('metric_value')), 'average'],
        [sequelize.fn('MIN', sequelize.col('metric_value')), 'min'],
        [sequelize.fn('MAX', sequelize.col('metric_value')), 'max']
      ],
      group: ['category']
    });

    // Recent entries
    const recentEntries = await SustainabilityData.findAll({
      order: [['date', 'DESC']],
      limit: 10
    });

    // Date range
    const dateRange = await SustainabilityData.findAll({
      attributes: [
        [sequelize.fn('MIN', sequelize.col('date')), 'earliest_date'],
        [sequelize.fn('MAX', sequelize.col('date')), 'latest_date']
      ]
    });

    res.json({
      success: true,
      summary: {
        totalRecords,
        categoryStats,
        dateRange: dateRange[0],
        recentEntries
      }
    });

  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching summary statistics'
    });
  }
};

// Get trend analysis
exports.getTrendAnalysis = async (req, res) => {
  try {
    const { category, months = 6 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    let whereClause = {
      date: {
        [Op.gte]: startDate
      }
    };

    if (category) {
      whereClause.category = category;
    }

    const trendData = await SustainabilityData.findAll({
      attributes: [
        'category',
        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('metric_value')), 'total'],
        [sequelize.fn('AVG', sequelize.col('metric_value')), 'average']
      ],
      where: whereClause,
      group: ['category', 'month'],
      order: [[sequelize.literal('month'), 'ASC']]
    });

    res.json({
      success: true,
      period: `Last ${months} months`,
      data: trendData
    });

  } catch (error) {
    console.error('Trend analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trend analysis'
    });
  }
};

// Delete all data (admin only)
exports.deleteAllData = async (req, res) => {
  try {
    await SustainabilityData.destroy({ 
      where: {}, 
      truncate: true 
    });

    res.json({
      success: true,
      message: 'All data deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting data'
    });
  }
};
