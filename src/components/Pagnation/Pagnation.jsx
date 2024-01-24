import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Pagnation = ({ totalPages, currentPage, onPageChange }) => {
    const handlePageChange = (event, newPage) => {
        onPageChange(newPage);
      };
  return (
    <>
    <Stack spacing={2}>
    <Pagination
        count={totalPages}
        page={currentPage}
        color="primary"
        onChange={handlePageChange}
        />    
    </Stack>
    </>
  )
}

export default Pagnation