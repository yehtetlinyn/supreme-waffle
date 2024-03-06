import React, { useState } from "react";
import Pagination from "./paginate";

const Paginate = ({ currentPage, setCurrentPage, pageCount }) => {
  // const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };
  return (
    <Pagination
      forcePage={currentPage}
      handlePageClick={handlePageClick}
      pageCount={pageCount}
    />
  );
};

export default Paginate;
