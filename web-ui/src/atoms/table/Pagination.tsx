import { Icons } from "@/assets";
import { IconButton } from "../button/IconButton";
import styles from "./Table.module.css";
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <IconButton
        onClick={handlePrev}
        disabled={currentPage === 1}
        icon={Icons.arrowLeftIcon}
        label={"Previous"}
        size={1.5}
      />

      <span>
        {currentPage} / {totalPages}
      </span>

      <IconButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        icon={Icons.arrowRightIcon}
        label={"Next"}
        size={1.5}
      />
    </div>
  );
}
