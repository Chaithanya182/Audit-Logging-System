import './LogTable.css';

function LogTable({ logs, loading }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const getStatusClass = (code) => {
        if (code >= 200 && code < 300) return 'status-success';
        if (code >= 400 && code < 500) return 'status-warning';
        if (code >= 500) return 'status-error';
        return '';
    };

    const getMethodClass = (method) => {
        const classes = {
            GET: 'method-get',
            POST: 'method-post',
            PUT: 'method-put',
            PATCH: 'method-patch',
            DELETE: 'method-delete'
        };
        return classes[method] || '';
    };

    if (loading) {
        return (
            <div className="table-loading">
                <div className="spinner"></div>
                <p>Loading logs...</p>
            </div>
        );
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="table-empty">
                <p>No logs found</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="log-table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Endpoint</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Response Time</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td className="cell-timestamp">{formatDate(log.timestamp)}</td>
                            <td className="cell-user">{log.user}</td>
                            <td className="cell-endpoint">{log.endpoint}</td>
                            <td>
                                <span className={`method-badge ${getMethodClass(log.method)}`}>
                                    {log.method}
                                </span>
                            </td>
                            <td>
                                <span className={`status-badge ${getStatusClass(log.statusCode)}`}>
                                    {log.statusCode}
                                </span>
                            </td>
                            <td className="cell-time">{log.responseTime}ms</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LogTable;
