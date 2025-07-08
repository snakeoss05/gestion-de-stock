"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

export default function PaginationComponent({
  totalPages = 10,
  currentPage = 1,
  onPageChange,
  showPreviousNext = true,
  maxVisiblePages = 5,
}) {
  const [activePage, setActivePage] = useState(currentPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
      onPageChange?.(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      const startPage = Math.max(
        2,
        activePage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(
        totalPages - 1,
        activePage + Math.floor(maxVisiblePages / 2)
      );

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("ellipsis");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination>
        <PaginationContent>
          {showPreviousNext && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(activePage - 1);
                }}
                className={
                  activePage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          )}

          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={page === activePage}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {showPreviousNext && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(activePage + 1);
                }}
                className={
                  activePage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      <div className="text-sm text-muted-foreground">
        Page {activePage} of {totalPages}
      </div>
    </div>
  );
}
