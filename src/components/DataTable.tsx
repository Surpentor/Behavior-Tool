import { useState, useMemo } from 'react';
import { BehaviorRecord } from '../types';
import '../styles/DataTable.css';

interface DataTableProps {
  records: BehaviorRecord[];
}

export default function DataTable({ records }: DataTableProps) {
  const [sortBy, setSortBy] = useState<'date' | 'category' | 'points'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedRecords = useMemo(() => {
    let sorted = [...records];

    sorted.sort((a, b) => {
      let compareA: string | number;
      let compareB: string | number;

      switch (sortBy) {
        case 'date':
          compareA = a.date.getTime();
          compareB = b.date.getTime();
          break;
        case 'category':
          compareA = a.category;
          compareB = b.category;
          break;
        case 'points':
          compareA = a.points;
          compareB = b.points;
          break;
      }

      if (typeof compareA === 'string') {
        return sortOrder === 'asc'
          ? compareA.localeCompare(compareB as string)
          : (compareB as string).localeCompare(compareA);
      }

      return sortOrder === 'asc' ? (compareA as number) - (compareB as number) : (compareB as number) - (compareA as number);
    });

    if (searchTerm) {
      sorted = sorted.filter(r =>
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.date.toLocaleDateString().includes(searchTerm)
      );
    }

    return sorted;
  }, [records, sortBy, sortOrder, searchTerm]);

  const handleSort = (column: 'date' | 'category' | 'points') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h3>📋 Detailed Records</h3>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Search by category or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handlePrint} className="print-button">
            🖨️ Print
          </button>
        </div>
      </div>

      {sortedRecords.length === 0 ? (
        <p className="empty-message">No records found</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className="sortable">
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Time</th>
                <th onClick={() => handleSort('category')} className="sortable">
                  Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('points')} className="sortable">
                  Points {sortBy === 'points' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.date.toLocaleDateString()}</td>
                  <td>{record.time}</td>
                  <td>{record.category}</td>
                  <td className="points">{record.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-footer">
        <p>
          Showing {sortedRecords.length} of {records.length} records
        </p>
      </div>
    </div>
  );
}
