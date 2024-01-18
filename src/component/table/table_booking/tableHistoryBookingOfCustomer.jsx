import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  Skeleton,
  TablePagination,
  TableSortLabel,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useMoneyFormatter from "../../../hook/useMoneyFormatter";
import bookingApi from "../../../utils/bookingAPI";
import "../table.scss";
import MenuActionChangeTicket from "../../menuAction/menuActionForChangeTicket/menuActionChangeTikcket";
import ModelEnterConfirmChangeTicketCode from "../model_popup/changeTicket/popupInputConfirmCodeChangeTicket";

export default function TableHistoryBookingOfCustomer() {
  // PAGINATION
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5, 10, 25, 50]; // Đặt giá trị mặc định là 5 hoặc số hàng tùy ý

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // MODEL CONFIRM CODE CHANGRE TICKET
  const [open, setOpen] = useState(false);
  const [selectedBookingData, setSelectedbookingData] = useState(null);

  const handleOpen = (bookingData) => {
    setSelectedbookingData(bookingData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Search Departure
  const [searchDeparture, setSearchDeparture] = useState("");

  const handleSearchDepartureChange = (event) => {
    setSearchDeparture(event.target.value);
  };

  // Search Destination
  const [searchDestination, setSearchDestination] = useState("");

  const handleSearchDestinationChange = (event) => {
    setSearchDestination(event.target.value);
  };

  const [dataBooking, setDataBooking] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const response = await bookingApi.getDataBookingOfCustomer({
          idCustomer: parseInt(id),
        });
        const bookings = response.data;
        console.log("dữ liệu vé của khách: ", bookings);
        setDataBooking(bookings);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("fetching trip data fail !");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [id]);

  //format money
  const [formatMoney] = useMoneyFormatter();

  // SORT bookingStatus
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSort = () => {
    const isAsc = orderBy === "bookingStatus" && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy("bookingStatus");
  };

  const sortedData = dataBooking?.slice().sort((a, b) => {
    const orderMultiplier = order === "asc" ? 1 : -1;
    const statusOrder = [
      "PAID",
      "CHECKIN",
      "NOT_CHECKIN",
      "NO_SHOW",
      "CANCELED",
      "FINISHED",
    ]; // Định nghĩa thứ tự sắp xếp

    if (
      statusOrder.indexOf(a.bookingStatus) <
      statusOrder.indexOf(b.bookingStatus)
    ) {
      return -1 * orderMultiplier;
    }
    if (
      statusOrder.indexOf(a.bookingStatus) >
      statusOrder.indexOf(b.bookingStatus)
    ) {
      return 1 * orderMultiplier;
    }
    return 0;
  });

  /* FINISHED HANDLE SORT bookingStatus*/

  // HANDLE FILTER SEARCH
  const filteredRows = sortedData.filter((row) => {
    // Kiểm tra xem station được điền có khớp với dữ liệu hay không
    const isDestinationMatch =
      !searchDestination ||
      (row.tripDTO.routeDTO.destination &&
        row.tripDTO.routeDTO.destination
          .toLowerCase()
          .includes(searchDestination.toLowerCase()));

    // Kiểm tra xem station được điền có khớp với dữ liệu hay không
    const isDeaprtureMatch =
      !searchDeparture ||
      (row.tripDTO.routeDTO.departurePoint &&
        row.tripDTO.routeDTO.departurePoint
          .toLowerCase()
          .includes(searchDeparture.toLowerCase()));

    return isDeaprtureMatch && isDestinationMatch;
  });

  return (
    <div>
      <Box sx={{ pb: "20px" }}>
        <TextField
          sx={{ mb: "10px" }}
          id="departurePoint"
          label="Tìm Kiếm Điểm Bắt Đầu"
          value={searchDeparture}
          onChange={handleSearchDepartureChange}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <TextField
          sx={{ ml: "20px" }}
          id="destination"
          label="Tìm Kiếm Điểm Kết Thúc"
          value={searchDestination}
          onChange={handleSearchDestinationChange}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              backgroundImage:
                "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
            }}
          >
            <TableRow>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                ID Đặt Vé
              </TableCell>

              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Thời Gian Bắt Đầu
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Thời Gian kết Thúc
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Điểm Bắt Đầu
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Điểm Kết Thúc
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Giá / 1 vé
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Chỗ Ngồi
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={handleSort}
                >
                  Trạng Thái
                </TableSortLabel>
              </TableCell>
              <TableCell
                className="tableTitle"
                sx={{ color: "#443A3E" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading
              ? filteredRows
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="tableCell">
                        {row.idBooking}
                      </TableCell>
                      <TableCell className="tableCell">
                        {moment(row?.trip?.departureDate * 1000).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
                      </TableCell>
                      <TableCell className="tableCell">
                        {moment(row?.trip?.endDate * 1000).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row?.onStation?.name}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row?.offStation?.name}
                      </TableCell>
                      <TableCell className="tableCell">
                        {formatMoney(row?.price)}
                      </TableCell>
                      <TableCell className="tableCell">
                        {" "}
                        {row?.seatName}
                      </TableCell>
                      <TableCell className="tableCell">
                        <span
                          className={`tripStatus ${row?.status}`}
                          style={{
                            color:
                              row?.status === "PAID"
                                ? "yellow"
                                : row?.status === "NOT_CHECKIN"
                                ? "blue"
                                : row?.status === "CHECKIN"
                                ? "green"
                                : row?.status === "NO_SHOW"
                                ? "gray"
                                : "",
                            border:
                              row?.status === "PAID"
                                ? "2px solid yellow"
                                : row?.status === "NOT_CHECKIN"
                                ? "2px solid  blue"
                                : row?.status === "CHECKIN"
                                ? "2px solid  green"
                                : row?.status === "NO_SHOW"
                                ? "2px solid  gray"
                                : "",
                            background:
                              row?.status === "NOT_CHECKIN"
                                ? "lightblue"
                                : row?.status === "PAID"
                                ? "lightyellow"
                                : row?.status === "CHECKIN"
                                ? "lightgreen"
                                : row?.status === "NO_SHOW"
                                ? "lightgray"
                                : "",
                            padding: "5px",
                          }}
                        >
                          {row?.status === "PAID"
                            ? "ĐÃ THANH TOÁN"
                            : row?.status === "NOT_CHECKIN"
                            ? "CHỜ CHECKIN"
                            : row?.status === "NO_SHOW"
                            ? "LỠ CHUYẾN"
                            : row?.status === "CHECKIN"
                            ? "ĐÃ CHECKIN"
                            : row?.status === "FINISHED"
                            ? "ĐÃ HOÀN THÀNH"
                            : row?.status === "CANCELED"
                            ? "HỦY"
                            : row?.status}
                        </span>
                      </TableCell>

                      <TableCell className="tableCell">
                        {row?.status === "PAID" && (
                          <MenuActionChangeTicket
                            bookingData={row}
                            onOpen={handleOpen}
                          />
                        )}
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
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                    <TableCell align="left">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
          {selectedBookingData && (
            <ModelEnterConfirmChangeTicketCode
              open={open}
              handleClose={handleClose}
              bookingData={selectedBookingData}
            />
          )}
        </Table>
        <TablePagination
          component="div"
          count={dataBooking.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </TableContainer>
    </div>
  );
}
