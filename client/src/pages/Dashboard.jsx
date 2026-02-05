import { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import LogTable from '../components/LogTable';
import Pagination from '../components/Pagination';
import { fetchLogs, fetchFilterOptions, exportLogs, callSampleEndpoint } from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const [options, setOptions] = useState({ endpoints: [], methods: [] });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
    });

    useEffect(() => {
        loadFilterOptions();
        loadLogs();
    }, []);

    const loadFilterOptions = async () => {
        try {
            const result = await fetchFilterOptions();
            if (result.success) {
                setOptions(result.data);
            }
        } catch (err) {
            console.error('Failed to load options:', err);
        }
    };

    const loadLogs = async (page = 1, limit = 20, filterParams = {}) => {
        setLoading(true);
        try {
            const result = await fetchLogs({ page, limit, ...filterParams });
            if (result.success) {
                setLogs(result.data);
                setPagination(result.pagination);
            }
        } catch (err) {
            console.error('Failed to load logs:', err);
        }
        setLoading(false);
    };

    const handleApplyFilters = () => {
        setAppliedFilters(filters);
        loadLogs(1, pagination.itemsPerPage, filters);
    };

    const handleResetFilters = () => {
        setFilters({});
        setAppliedFilters({});
        loadLogs(1, pagination.itemsPerPage, {});
    };

    const handlePageChange = (page) => {
        loadLogs(page, pagination.itemsPerPage, appliedFilters);
    };

    const handleLimitChange = (limit) => {
        loadLogs(1, limit, appliedFilters);
    };

    const handleExport = () => {
        exportLogs(appliedFilters);
    };

    const handleGenerateLogs = async () => {
        const endpoints = [
            { path: '/users', method: 'GET' },
            { path: '/users/1', method: 'GET' },
            { path: '/products', method: 'GET' },
            { path: '/products?category=Electronics', method: 'GET' },
            { path: '/orders', method: 'POST', body: { items: [1, 2], total: 100 } }
        ];

        for (const ep of endpoints) {
            await callSampleEndpoint(ep.path, ep.method, ep.body);
        }

        setTimeout(() => {
            loadLogs(1, pagination.itemsPerPage, appliedFilters);
            loadFilterOptions();
        }, 500);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Audit Log Dashboard</h1>
                    <p>Monitor and analyze API request logs</p>
                </div>
                <div className="header-actions">
                    <button className="btn-generate" onClick={handleGenerateLogs}>
                        Generate Sample Logs
                    </button>
                    <button className="btn-export" onClick={handleExport}>
                        Export CSV
                    </button>
                </div>
            </header>

            <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                options={options}
            />

            <LogTable logs={logs} loading={loading} />

            {pagination.totalItems > 0 && (
                <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            )}
        </div>
    );
}

export default Dashboard;
