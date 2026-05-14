import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { StudentData, BehaviorRecord } from '../types';

export async function parseFile(file: File): Promise<StudentData> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  let data: string[][] = [];

  if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || fileType.includes('spreadsheet')) {
    data = await parseExcel(file);
  } else if (fileName.endsWith('.csv')) {
    data = await parseCSV(file);
  } else if (fileName.endsWith('.tsv')) {
    data = await parseTSV(file);
  } else if (fileName.endsWith('.ods')) {
    data = await parseExcel(file);
  } else if (fileName.endsWith('.html')) {
    data = await parseHTML(file);
  } else {
    throw new Error('Unsupported file format');
  }

  return processData(data);
}

async function parseExcel(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
        resolve(data as string[][]);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
}

async function parseCSV(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        Papa.parse(csv, {
          header: false,
          complete: (results) => {
            resolve(results.data as string[][]);
          },
          error: (error) => reject(error)
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

async function parseTSV(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const tsv = e.target?.result as string;
        Papa.parse(tsv, {
          header: false,
          delimiter: '\t',
          complete: (results) => {
            resolve(results.data as string[][]);
          },
          error: (error) => reject(error)
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

async function parseHTML(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const html = e.target?.result as string;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const table = doc.querySelector('table');
        const data: string[][] = [];

        if (table) {
          const rows = table.querySelectorAll('tr');
          rows.forEach((row) => {
            const cells = row.querySelectorAll('td, th');
            const rowData: string[] = [];
            cells.forEach((cell) => {
              rowData.push(cell.textContent?.trim() || '');
            });
            if (rowData.length > 0) data.push(rowData);
          });
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function processData(rawData: string[][]): StudentData {
  if (rawData.length < 2) {
    throw new Error('Invalid data format: insufficient data');
  }

  const headers = rawData[0].map(h => h.toLowerCase().trim());
  const nameIdx = headers.findIndex(h => h.includes('name'));
  const locationIdx = headers.findIndex(h => h.includes('location'));
  const dateIdx = headers.findIndex(h => h.includes('date') && !h.includes('time'));
  const timeIdx = headers.findIndex(h => h.includes('time'));

  const name = nameIdx >= 0 ? rawData[1][nameIdx] : 'Unknown Student';
  const location = locationIdx >= 0 ? rawData[1][locationIdx] : 'Unknown Location';
  const dataDate = dateIdx >= 0 ? rawData[1][dateIdx] : new Date().toISOString().split('T')[0];

  const timeHeaders = headers.filter((h, idx) => {
    return idx > 3 && /^\d{1,2}:\d{2}/.test(h);
  });

  const categoryStartIdx = headers.findIndex((h, idx) =>
    idx > 3 && (h.includes('work') || h.includes('hand') || h.includes('stay') || h.includes('language'))
  );

  const records: BehaviorRecord[] = [];
  const categories = new Set<string>();

  for (let i = 4; i < rawData.length; i++) {
    const row = rawData[i];
    const categoryName = row[0]?.trim() || '';

    if (!categoryName || categoryName.includes('total') || categoryName.includes('point')) {
      continue;
    }

    categories.add(categoryName);

    for (const timeHeader of timeHeaders) {
      const colIdx = headers.indexOf(timeHeader);
      const pointsStr = row[colIdx]?.trim();
      const points = parseFloat(pointsStr) || 0;

      if (points > 0) {
        records.push({
          date: new Date(dataDate),
          time: timeHeader,
          category: categoryName,
          points
        });
      }
    }
  }

  const startDate = new Date(dataDate);
  const endDate = new Date(dataDate);

  return {
    name,
    location,
    date: dataDate,
    records,
    totalPoints: records.reduce((sum, r) => sum + r.points, 0),
    categories: Array.from(categories),
    dateRange: {
      start: startDate,
      end: endDate
    }
  };
}
