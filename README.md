# Behavior School Data Tool

A single-page, browser-only tool for analyzing one student's behavior-tracking workbook (.xlsx). It charts trends, time-of-day patterns, BIP goals, custom tracking and heatmaps, and prints reports.

**Privacy:** everything runs locally in the browser. The file is never uploaded, and the data is cleared on refresh or close.

## Running it

The whole app is `index.html`. Open it in any modern browser (double-click, or host it on any static web server such as GitHub Pages). No install or build step.

Needs internet access to load two libraries from jsDelivr:
- [SheetJS](https://sheetjs.com/) `xlsx@0.18.5` (reads the workbook)
- [Chart.js](https://www.chartjs.org/) `4.4.0` (charts)

## Using it

1. Click the upload area and choose the student's workbook.
2. Browse the tabs:
   - **Insights** – overall average trend (peaks/valleys highlighted) and category averages
   - **Categories** – per-category trend and performance charts (the category checkboxes here only filter this tab)
   - **Time-of-Day** – average score per time slot
   - **BIP Goals** – frequency, duration and intensity per goal
   - **Custom Tracking** – the three free-form tracking rows
   - **Heatmap** – time-slot, category, average and daily-summary heatmaps, plus three BIP views: by time of day (one goal), time-slot averages (all goals) and daily totals. BIP colors run pale (0 = did not occur) to dark red (highest); grey means nothing was recorded. The time-slot BIP views need BIP numbers in the slot cells (B–Z); the daily view uses the totals column.
   - **Date Comparison** – compare chosen days side by side
   - **Summary Table** – per-day table with pinned headers and Date column, averages, and BIP frequency/duration totals; exportable to CSV
   - **Settings** – date range filter, fix a single day's date, show/hide tracking rows, data-quality notes
3. Use **expand** or **print** on any chart, or **Print Full Report** (see below).

## Full report

**Print Full Report** opens a dialog where you choose which sections to include: overview, overall trend, category charts, time-of-day, BIP goals, custom tracking, day-by-day table and data-quality notes. The report uses the current date filter and is laid out for US Letter (8.5×11, portrait, 0.5in margins):

- Every chart is re-drawn at a fixed print size and high resolution, including charts on tabs you haven't opened. About two charts fit on each page.
- A chart is never split across pages. If it doesn't fit, it moves to the next page.
- The day-by-day table starts on a new page. Its columns are split into tables of at most 10 columns. Categories, tracking and each BIP goal's frequency/duration/intensity always stay together. A table that fits on one page is never split. A longer table only breaks between rows, and its header repeats on each page.
- Each page has a footer with the student, date range and page number (in browsers that support it, e.g. Chrome or Edge).

For best results, print from Chrome or Edge with **Background graphics** on and margins left at **Default**.

## Expected workbook layout

- **One sheet per month**, named with the month (e.g. `January`, `Sept 2024`). Sheets named `Master` or `Overall Summary` are skipped.
- **Row 1:** student name in A1, location in B1.
- **Each day is a 22-row block** starting with the date in column A:

| Block row | Content |
|---|---|
| 0 | Date |
| 1–4 | Categories: Complete Work · Hands, Body, Objects to self · Stay in Designated area · App. language/conversations |
| 7–9 | Three custom tracking rows (label in A, total in column AA) |
| 10–21 | BIP goal sections: a row containing "BIP", followed by frequency, duration and intensity rows (totals in column AA) |

- **Time slots** are columns B–Z (25 slots). Blank cells mean "no data for that slot". A category's daily percentage is points ÷ slots with data × 100.
- A row in column A starting with "Monthly report" ends that sheet's daily data.

### Date formats

The date cell can be a real Excel date or text in almost any common format:

`1/5/2025` · `01-05-25` · `1.5.2025` · `1/5` · `2025-01-05` · `2025/1/5` · `Jan 5 2025` · `January 5th, 2025` · `Sept. 5, 2024` · `5 Jan 2025` · `5-Jan-25` · `Monday, January 5, 2025` · `Mon 1/5/25` · trailing times like `8:00 AM` are ignored.

Numeric dates are read month-first (US). If the first number is over 12 (e.g. `25/12/2024`), it is read day-first. Impossible dates like `2/30/2025` are rejected. A date without a year gets the current year, then the correction below applies.

### Automatic date corrections

Typos in dates are fixed automatically and listed under **Settings → Data Quality Issues**:
- If a date's month doesn't match its sheet's month, the month is changed to the sheet's.
- If a date's year differs from the year used by most of the sheet, the year is changed to match.

## Code map (`index.html`)

| Function | Purpose |
|---|---|
| `handleFileUpload` / `parseMultiSheetXlsx` | Read workbook, walk sheets, apply date corrections, drop BIP goals and tracking rows with no activity |
| `toDate`, `monthFromName`, `parseMonthFromSheetName` | Date and month recognition |
| `parseDayBlock` | Parse one 22-row day block |
| `initializeDashboard`, `buildDynamicCharts`, `refreshCharts` | Build the dashboard after loading |
| `update*Chart`, `updateInsights` | Chart rendering per tab |
| `render*Heatmap`, `generateHeatmapView` | Heatmaps |
| `renderComparison` | Date comparison tab |
| `updateSummaryTable`, `exportSummaryCsv` | Summary table and CSV |
| `printChart` | Print a single chart |
| `printFullReport`, `generateFullReport`, `renderChartForPrint` | Full-report dialog, Letter-size layout, off-screen chart rendering |
