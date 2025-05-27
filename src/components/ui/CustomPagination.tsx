import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";

interface CustomPaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  pageSize,
  total,
  onChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageClick = (page: number | string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (typeof page === "number" && page !== currentPage) {
      onChange(page);
    }
  };

  return (
    <div className="flex justify-center flex-wrap gap-2 mt-4">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded text-[20px] hover:bg-[var(--active-color)] hover:text-white disabled:bg-transparent disabled:text-black disabled:opacity-50"
      >
        <LeftOutlined />
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          disabled={typeof page !== "number"}
          className={`px-3 py-2 rounded text-[20px] transition font-[600] 
            ${
              page === currentPage
                ? "bg-[var(--active-color)] text-white"
                : typeof page === "number"
                ? "hover:bg-[var(--active-color)] hover:text-white"
                : "cursor-default text-gray-500"
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded text-[20px] hover:bg-[var(--active-color)] hover:text-white disabled:bg-transparent disabled:text-black disabled:opacity-50"
      >
        <RightOutlined />
      </button>
    </div>
  );
};

export default CustomPagination;
