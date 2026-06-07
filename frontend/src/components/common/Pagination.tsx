import React from 'react';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>Previous</button>
        </li>
        {pages[0] > 1 && (
          <>
            <li className="page-item"><button className="page-link" onClick={() => onPageChange(1)}>1</button></li>
            {pages[0] > 2 && <li className="page-item disabled"><span className="page-link">…</span></li>}
          </>
        )}
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <li className="page-item disabled"><span className="page-link">…</span></li>}
            <li className="page-item"><button className="page-link" onClick={() => onPageChange(totalPages)}>{totalPages}</button></li>
          </>
        )}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>Next</button>
        </li>
      </ul>
    </nav>
  );
}
