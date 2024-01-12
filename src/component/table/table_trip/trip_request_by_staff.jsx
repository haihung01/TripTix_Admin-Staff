import {
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  TablePagination,
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
import { toast } from "react-toastify";
import listTripApi from "../../../utils/listTripAPI";
import ModalApprovedTrip from "../model_popup/trip-managements/modelApprovedTrip";
import "../table.scss";
import useAuth from "../../../hook/useAuth";
import SearchIcon from "@mui/icons-material/Search";

const TripRequestPendingByStaff = () => {
  const { auth } = useAuth();

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

  // TRIP APPROVED
  const [open, setOpen] = useState(false);
  const [selectedTripData, setSelectedTripData] = useState(null);

  const handleOpen = (tripData) => {
    setSelectedTripData(tripData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [dataTrip, setDataTrip] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListTrip = async () => {
    try {
      setLoading(true);
      const params = { staffId: auth.user.idUserSystem };
      const response = await listTripApi.getTripByStaffIdAndAdminCheckPending(
        params
      );
      const trips = response.data;
      console.log("my data: ", response.data);
      setDataTrip(trips);
    } catch (error) {
      console.log("err", error);
      setDataTrip([]);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Load Data failed !");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListTrip();
  }, []);

  // FILTER BY DATE AND departurePoint & destination
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const [startPoint, setStartPoint] = useState("");

  const handleStartPointChange = (event) => {
    setStartPoint(event.target.value);
  };

  const filteredRows = dataTrip.filter((row) => {
    const isStartPointMatch =
      !startPoint ||
      row?.route?.name.toLowerCase().includes(startPoint.toLowerCase());

    if (!startDate && !endDate) return isStartPointMatch;

    if (!row?.departureDateLT) return false;

    const rowStartDate = moment(row?.departureDateLT * 1000)
      .subtract(7, "hours")
      .startOf("day");
    const rowEndDate = moment(row?.departureDateLT * 1000)
      .subtract(7, "hours")
      .endOf("day");

    if (startDate && endDate) {
      const startMoment = moment(startDate).startOf("day");
      const endMoment = moment(endDate).endOf("day");
      return (
        isStartPointMatch &&
        rowStartDate.isSameOrBefore(endMoment) &&
        rowEndDate.isSameOrAfter(startMoment)
      );
    }

    if (startDate) {
      const startMoment = moment(startDate).startOf("day");
      return isStartPointMatch && rowStartDate.isSameOrAfter(startMoment);
    }

    if (endDate) {
      const endMoment = moment(endDate).endOf("day");
      return isStartPointMatch && rowEndDate.isSameOrBefore(endMoment);
    }

    return isStartPointMatch;
  });

  return (
    <div>
      <Box sx={{ pb: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={4} md={2}>
            <TextField
              id="startDate"
              label="Lọc Từ Ngày"
              size="small"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <TextField
              id="endDate"
              label="Lọc Đến Ngày"
              size="small"
              fullWidth
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="startPoint"
              label="Điểm Bắt Đầu"
              size="small"
              fullWidth
              value={startPoint}
              onChange={handleStartPointChange}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
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
                Thời Gian Kết Thúc
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Tên Chuyến
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Tình Trạng
              </TableCell>
              {auth?.user?.role === "ROLE_ADMIN" && (
                <TableCell
                  className="tableCell"
                  sx={{ fontWeight: "bold" }}
                ></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filteredRows.length > 0 ? (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.idTrip}>
                    <TableCell className="tableCell">{row.idTrip}</TableCell>
                    <TableCell className="tableCell">
                      {moment(row?.departureDateLT * 1000)
                        .subtract(7, "hours")
                        .format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                    <TableCell className="tableCell">
                      {moment(row?.endDateLT * 1000)
                        .subtract(7, "hours")
                        .format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row?.route?.name}
                    </TableCell>
                    <TableCell className="tableCell">
                      <span className={`tripRqStatus ${row.adminCheck}`}>
                        CHỜ DUYỆT
                      </span>
                    </TableCell>
                    {auth?.user?.role === "ROLE_ADMIN" && (
                      <TableCell className="tableCell">
                        <Button
                          onClick={() => handleOpen(row)}
                          sx={{
                            backgroundColor: "#FF5B94",
                            color: "white",
                            width: "160px",
                            ":hover": { bgcolor: "#F84180" },
                          }}
                        >
                          Duyệt Chuyến
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
            ) : !loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <div sx={{ textAlign: "center" }}>
                    <img
                      src="https://www.pngall.com/wp-content/uploads/2016/05/Bus-Free-Download-PNG.png"
                      height={350}
                      width={400}
                      alt=""
                    />
                  </div>
                  <div sx={{ textAlign: "center", marginTop: "10px" }}>
                    <h2 sx={{ display: "inline-block" }}>
                      Hiện chưa có chuyến...
                    </h2>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
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
                  {auth?.user?.role === "ROLE_ADMIN" && (
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
          {selectedTripData && (
            <ModalApprovedTrip
              open={open}
              handleClose={handleClose}
              tripData={selectedTripData}
              fetchListTrip={fetchListTrip}
            />
          )}
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

export default TripRequestPendingByStaff;
