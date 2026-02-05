import { useState } from 'react';
import './FilterPanel.css';

function FilterPanel({ filters, onFilterChange, onApply, onReset, options }) {
    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="filter-panel">
            <div className="filter-group">
                <label>User</label>
                <input
                    type="text"
                    placeholder="Search by user/IP..."
                    value={filters.user || ''}
                    onChange={(e) => handleChange('user', e.target.value)}
                />
            </div>

            <div className="filter-group">
                <label>Endpoint</label>
                <select
                    value={filters.endpoint || ''}
                    onChange={(e) => handleChange('endpoint', e.target.value)}
                >
                    <option value="">All Endpoints</option>
                    {options.endpoints?.map((ep) => (
                        <option key={ep} value={ep}>{ep}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>Method</label>
                <select
                    value={filters.method || ''}
                    onChange={(e) => handleChange('method', e.target.value)}
                >
                    <option value="">All Methods</option>
                    {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>Start Date</label>
                <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                />
            </div>

            <div className="filter-group">
                <label>End Date</label>
                <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                />
            </div>

            <div className="filter-actions">
                <button className="btn-apply" onClick={onApply}>Apply</button>
                <button className="btn-reset" onClick={onReset}>Reset</button>
            </div>
        </div>
    );
}

export default FilterPanel;
