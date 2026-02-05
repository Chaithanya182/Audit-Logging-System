import './Pagination.css';

function Pagination({ pagination, onPageChange, onLimitChange }) {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">
            <div className="pagination-info">
                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </div>

            <div className="pagination-controls">
                <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                >
                    ««
                </button>
                <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    «
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        className={`page-btn ${page === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    »
                </button>
                <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(totalPages)}
                >
                    »»
                </button>
            </div>

            <div className="pagination-limit">
                <label>Per page:</label>
                <select value={itemsPerPage} onChange={(e) => onLimitChange(Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
        </div>
    );
}

export default Pagination;
