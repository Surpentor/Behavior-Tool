import '../styles/Filters.css';

interface FiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  quickRangeFilter: string;
  onQuickRangeChange: (range: string) => void;
}

export default function Filters({
  categories,
  selectedCategories,
  onCategoriesChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  quickRangeFilter,
  onQuickRangeChange,
}: FiltersProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      onCategoriesChange([]);
    } else {
      onCategoriesChange([...categories]);
    }
  };

  const handleDateChange = (which: 'start' | 'end', date: string) => {
    const newDate = new Date(date);
    if (which === 'start') {
      onStartDateChange(newDate);
      onQuickRangeChange('custom');
    } else {
      onEndDateChange(newDate);
      onQuickRangeChange('custom');
    }
  };

  return (
    <div className="filters">
      <div className="filter-section">
        <h3>📅 Date Range</h3>
        <div className="quick-filters">
          <button
            className={`quick-btn ${quickRangeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onQuickRangeChange('all')}
          >
            All Data
          </button>
          <button
            className={`quick-btn ${quickRangeFilter === 'last7' ? 'active' : ''}`}
            onClick={() => onQuickRangeChange('last7')}
          >
            Last 7 Days
          </button>
          <button
            className={`quick-btn ${quickRangeFilter === 'last30' ? 'active' : ''}`}
            onClick={() => onQuickRangeChange('last30')}
          >
            Last 30 Days
          </button>
          <button
            className={`quick-btn ${quickRangeFilter === 'last90' ? 'active' : ''}`}
            onClick={() => onQuickRangeChange('last90')}
          >
            Last 90 Days
          </button>
        </div>

        {quickRangeFilter === 'all' && (
          <div className="date-inputs">
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
            <span>to</span>
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('end', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="filter-section">
        <h3>📊 Behavior Categories</h3>
        <button className="select-all-btn" onClick={handleSelectAll}>
          {selectedCategories.length === categories.length ? 'Deselect All' : 'Select All'}
        </button>
        <div className="category-list">
          {categories.map(category => (
            <label key={category} className="category-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
