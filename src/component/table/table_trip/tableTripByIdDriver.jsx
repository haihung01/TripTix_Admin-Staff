import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  Rating,
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
import listTripApi from "../../../utils/listTripAPI";
import "../table.scss";
import useMoneyFormatter from "../../../hook/useMoneyFormatter";

const List = () => {
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

  const [dataTrip, setDataTrip] = useState([]);
  const [loadingTrip, setLoadingTrip] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoadingTrip(true);
        const params = { driverId: parseInt(id) };
        const response = await listTripApi.getTripByDriverId(params);
        const trips = response.data;
        setDataTrip(trips);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("fetching trip data fail !");
      } finally {
        setLoadingTrip(false);
      }
    };

    fetchTripData();
  }, [id]);

  //format money
  const [formatMoney] = useMoneyFormatter();

  // SORT STATUS
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSort = () => {
    const isAsc = orderBy === "status" && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy("status");
  };

  const sortedData = dataTrip.slice().sort((a, b) => {
    const orderMultiplier = order === "asc" ? 1 : -1;
    const statusOrder = ["RUN", "READY", "FINISH", "CANCEL"]; // Định nghĩa thứ tự sắp xếp

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status)) {
      return -1 * orderMultiplier;
    }
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) {
      return 1 * orderMultiplier;
    }
    return 0;
  });

  /* FINISH HANDLE SORT STATUS*/

  // HANDLE FILTER SEARCH
  const filteredRows = sortedData.filter((row) => {
    // Kiểm tra xem station được điền có khớp với dữ liệu hay không
    const isDestinationMatch =
      !searchDestination ||
      (row.routeDTO.destination &&
        row.routeDTO.destination
          .toLowerCase()
          .includes(searchDestination.toLowerCase()));

    // Kiểm tra xem station được điền có khớp với dữ liệu hay không
    const isDeaprtureMatch =
      !searchDeparture ||
      (row.routeDTO.departurePoint &&
        row.routeDTO.departurePoint
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
                ID Chuyến Đi
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
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={handleSort}
                >
                  Trạng Thái
                </TableSortLabel>
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Đánh Giá
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loadingTrip
              ? filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.idTrip}>
                      <TableCell className="tableCell">{row.idTrip}</TableCell>
                      <TableCell className="tableCell">
                        {moment(row.startTimee * 1000).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
                      </TableCell>
                      <TableCell className="tableCell">
                        {moment(row.endTimee * 1000).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row.routeDTO.departurePoint}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row.routeDTO.destination}
                      </TableCell>
                      <TableCell className="tableCell">
                        {formatMoney(row?.fare)}
                      </TableCell>
                      <TableCell className="tableCell">
                        <span className={`tripStatus ${row.status}`}>
                          {row.status === "RUN"
                            ? "ĐANG ĐI"
                            : row.status === "READY"
                            ? "CHUẨN BỊ"
                            : row.status === "FINISH"
                            ? "ĐÃ HOÀN THÀNH"
                            : row.status === "CANCEL"
                            ? "ĐÃ HỦY"
                            : row.status}
                        </span>
                      </TableCell>
                      <TableCell className="tableCell">
                        <Rating
                          name={`rating-${row.tripID}`}
                          value={row.averageStar}
                          precision={0.2}
                          readOnly
                        />
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
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={dataTrip.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </TableContainer>
    </div>
  );
};

export default List;
