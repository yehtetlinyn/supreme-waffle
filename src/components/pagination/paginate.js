import React from "react";
import ReactPaginate from "react-paginate";
import styles from "./pagination.module.css";
import { usePathname } from "next/navigation";
import { GrNext, GrPrevious } from "react-icons/gr";
const Pagination = ({ pageCount, handlePageClick, forcePage }) => {
  let fp = forcePage - 1;

  const pathname = usePathname();
  const importUser = pathname === "/settings/manageUsers/create";

  return (
    <div
      className={
        importUser ? styles.importUsersPagination : styles.paginationWrapper
      }
    >
      <ReactPaginate
        previousLabel={importUser ? <GrPrevious /> : "Prev"}
        nextLabel={importUser ? <GrNext /> : "Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        previousLinkClassName={"page-link next-page-item"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link next-page-item"}
        marginPagesDisplayed={2}
        containerClassName={"pagination pagination-simple"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        activeClassName={styles.active}
        forcePage={fp}
      />
    </div>
  );
};

export default Pagination;
