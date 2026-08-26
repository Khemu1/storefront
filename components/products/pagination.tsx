import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-14">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? "default" : "outline"}
          size="sm"
          className="rounded-full w-9 h-9 p-0"
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
