const xlsx = require('xlsx');
const path = require('path');

// Generate a sample Excel template for users
const generateSampleTemplate = () => {
  // Sample data structure
  const sampleData = [
    {
      metric_name: 'CO2 Emissions',
      metric_value: 1250.5,
      date: '2024-01-15',
      category: 'Carbon'
    },
    {
      metric_name: 'Water Usage',
      metric_value: 5400.75,
      date: '2024-01-15',
      category: 'Water'
    },
    {
      metric_name: 'Electricity Consumption',
      metric_value: 8900.25,
      date: '2024-01-15',
      category: 'Energy'
    },
    {
      metric_name: 'Waste Generated',
      metric_value: 340.5,
      date: '2024-01-15',
      category: 'Waste'
    },
    {
      metric_name: 'Renewable Energy',
      metric_value: 2100.0,
      date: '2024-01-20',
      category: 'Energy'
    },
    {
      metric_name: 'Recycling Rate',
      metric_value: 65.5,
      date: '2024-01-20',
      category: 'Waste'
    }
  ];

  // Create workbook and worksheet
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(sampleData);

  // Set column widths
  ws['!cols'] = [
    { wch: 25 }, // metric_name
    { wch: 15 }, // metric_value
    { wch: 15 }, // date
    { wch: 15 }  // category
  ];

  // Add worksheet to workbook
  xlsx.utils.book_append_sheet(wb, ws, 'Sustainability Data');

  // Add instructions sheet
  const instructions = [
    { Column: 'metric_name', Description: 'Name of the metric (e.g., CO2 Emissions)', Required: 'Yes', Type: 'Text' },
    { Column: 'metric_value', Description: 'Numeric value of the metric', Required: 'Yes', Type: 'Number' },
    { Column: 'date', Description: 'Date in YYYY-MM-DD format', Required: 'Yes', Type: 'Date' },
    { Column: 'category', Description: 'Must be: Carbon, Water, Energy, Waste, or Other', Required: 'Yes', Type: 'Text' }
  ];

  const wsInstructions = xlsx.utils.json_to_sheet(instructions);
  wsInstructions['!cols'] = [
    { wch: 15 },
    { wch: 50 },
    { wch: 10 },
    { wch: 10 }
  ];

  xlsx.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  // Save to file
  const templatePath = path.join(__dirname, '../templates/sustainability_template.xlsx');
  xlsx.writeFile(wb, templatePath);

  console.log(`✓ Template generated at: ${templatePath}`);
  return templatePath;
};

// Run this if called directly
if (require.main === module) {
  generateSampleTemplate();
}

module.exports = { generateSampleTemplate };