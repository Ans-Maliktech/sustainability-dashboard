const xlsx = require('xlsx');
const sequelize = require('../config/database');
const SustainabilityData = require('../models/SustainabilityData');

// Upload and replace all data
exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded. Please select an Excel file.' 
      });
    }

    // Parse Excel file from buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Excel file is empty or has no valid data' 
      });
    }

    // 🛡️ SECURITY CHECK: Validate Column Headers Immediately
    const fileHeaders = Object.keys(jsonData[0]);
    const requiredHeaders = ['metric_name', 'metric_value', 'date', 'category'];
    const missingHeaders = requiredHeaders.filter(h => !fileHeaders.includes(h));
    
    if (missingHeaders.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid File Format. Missing required columns: ${missingHeaders.join(', ')}. Please use the correct template.`
      });
    }

    // Validate and transform data
    const transformedData = [];
    const errors = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // Excel row number (accounting for header)

      try {
        // Parse and validate metric_value
        const metricValue = parseFloat(row.metric_value);
        if (isNaN(metricValue)) {
          errors.push(`Row ${rowNumber}: Invalid metric_value (must be a number)`);
          continue;
        }

        // Parse date
        let parsedDate;
        if (typeof row.date === 'number') {
          // Excel serial date
          parsedDate = xlsx.SSF.parse_date_code(row.date);
          parsedDate = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d);
        } else {
          parsedDate = new Date(row.date);
        }

        if (isNaN(parsedDate.getTime())) {
          errors.push(`Row ${rowNumber}: Invalid date format`);
          continue;
        }

        // Validate category
        const validCategories = ['Carbon', 'Water', 'Energy', 'Waste', 'Other'];
        // Handle case sensitivity nicely (e.g. "carbon" -> "Carbon")
        let categoryInput = String(row.category).trim();
        // Capitalize first letter to match validCategories
        categoryInput = categoryInput.charAt(0).toUpperCase() + categoryInput.slice(1).toLowerCase();

        if (!validCategories.includes(categoryInput)) {
          errors.push(`Row ${rowNumber}: Invalid category '${row.category}'. Must be one of: ${validCategories.join(', ')}`);
          continue;
        }

        transformedData.push({
          metric_name: String(row.metric_name).trim(),
          metric_value: metricValue,
          date: parsedDate,
          category: categoryInput
        });

      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error.message}`);
      }
    }

    // If there are errors, return them
    if (errors.length > 0 && transformedData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'File contains errors. No data was imported.',
        errors: errors
      });
    }

    // Database transaction: Wipe old data and insert new data
    await sequelize.transaction(async (t) => {
      // Delete all existing records
      await SustainabilityData.destroy({ 
        where: {}, 
        truncate: true,
        transaction: t 
      });

      // Bulk insert new records
      if (transformedData.length > 0) {
        await SustainabilityData.bulkCreate(transformedData, {
          transaction: t,
          validate: true
        });
      }
    });

    res.json({
      success: true,
      message: 'Data uploaded successfully',
      recordsProcessed: transformedData.length,
      recordsSkipped: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing file',
      error: error.message
    });
  }
};

// Get upload statistics
exports.getUploadStats = async (req, res) => {
  try {
    const totalRecords = await SustainabilityData.count();
    
    const categoryStats = await SustainabilityData.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category']
    });

    const dateRange = await SustainabilityData.findAll({
      attributes: [
        [sequelize.fn('MIN', sequelize.col('date')), 'earliest_date'],
        [sequelize.fn('MAX', sequelize.col('date')), 'latest_date']
      ]
    });

    res.json({
      success: true,
      stats: {
        totalRecords,
        byCategory: categoryStats,
        dateRange: dateRange[0]
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};