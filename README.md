# Behavior School Data Tool

A web-based tool for analyzing and visualizing behavior tracking data from schools. Built to help educators identify trends, anomalies, and patterns in student behavior.

## Features

✨ **No Data Persistence** - All data is loaded into browser memory and completely cleared when you close the application

📊 **Data Visualization**
- Interactive charts (printable)
- Daily trends
- Category distribution
- Time-of-day analysis
- Behavioral comparisons

🔍 **Analysis Tools**
- Trend detection (improving/declining/stable)
- Anomaly detection with severity levels
- Statistical analysis
- Discrepancy flagging

📁 **File Format Support**
- Excel (.xls, .xlsx)
- CSV/TSV
- LibreOffice (.ods)
- HTML tables
- PDF (via text extraction)

🎯 **Features**
- Single-student data analysis
- Flexible date range filtering (all data, last 7/30/90 days, custom)
- Multi-category behavioral tracking
- Detailed data tables with search and sort
- Printable reports and charts

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

## Building

```bash
npm run build
```

## How to Use

1. **Load Data**: Click the upload area and select your exported behavior tracking file
2. **Analyze**: View key metrics, trends, and anomalies
3. **Filter**: Use date ranges and category filters to focus your analysis
4. **Visualize**: View interactive charts showing behavioral patterns
5. **Export**: Print individual charts or the entire report

## Data Format

The tool expects exported data with the following structure:
- Student name and location in the first rows
- Behavioral categories (Complete Work, Hands/Body/Objects to self, Stay in Designated area, Language/Conversations)
- Time slots as columns
- Point values in the data cells
- Support for BIP Goals and additional tracking sections

## Privacy

This tool processes all data locally in your browser. No data is saved to any server or stored between sessions. When you close the browser or refresh the page, all loaded data is cleared.
