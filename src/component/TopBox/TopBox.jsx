import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import bookingApi from "../../utils/bookingAPI";
import { toast } from "react-toastify";
import useMoneyFormatter from "../../hook/useMoneyFormatter";

export default function TopDeal() {
  // PAGINATION
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Đặt giá trị mặc định là 10 hoặc số hàng tùy ý
  const rowsPerPageOptions = [5, 10, 20, 30, 50];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // DATA API
  const [dataCustomer, setDataCustomer] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListUser = async () => {
      try {
        setLoading(true);
        const response = await bookingApi.getDataPotentialCustomer();
        console.log("dataTBL", response);
        setDataCustomer(response.data);
      } catch (error) {
        console.log("err", error);
        setDataCustomer([]);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Load Data failed !");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchListUser();
  }, []);

  //format money
  const [formatMoney] = useMoneyFormatter();

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: "20vw" }} aria-label="simple table">
        <TableHead
          sx={{
            backgroundImage:
              "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
          }}
        >
          <TableRow>
            <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
              Người Dùng
            </TableCell>
            <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
              Tổng Chi Tiêu
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading
            ? dataCustomer?.map((row) => (
                <TableRow key={row.top}>
                  <TableCell className="tableCell">
                    {row?.nameCustomer}
                  </TableCell>
                  <TableCell className="tableCell">
                    {formatMoney(row?.totalPriceUsed)}
                  </TableCell>
                </TableRow>
              ))
            : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                <TableRow hover={true} key={index}>
                  <TableCell align="left">
                    <Skeleton variant="rectangular" />
                  </TableCell>
                  <TableCell align="left">
                    <Skeleton variant="rectangular" />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={dataCustomer.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </TableContainer>
  );
}
