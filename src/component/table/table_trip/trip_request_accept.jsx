import { Box, Grid, Skeleton, TablePagination, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import "../table.scss";
import listTripApi from "../../../utils/listTripAPI";
import { toast } from "react-toastify";
import moment from "moment";
import useMoneyFormatter from "../../../hook/useMoneyFormatter";

const TripRequestAccept = () => {
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

  const [dataTrip, setDataTrip] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListTrip = async () => {
      try {
        setLoading(true);
        const response = await listTripApi.getAll({
          adminCheck: "accept",
          status: "READY",
        });
        console.log("dataTBL", response);
        setDataTrip(response.data);
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
    fetchListTrip();
  }, []);

  //format money
  const [formatMoney] = useMoneyFormatter();

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
  const [endPoint, setEndPoint] = useState("");

  const handleStartPointChange = (event) => {
    setStartPoint(event.target.value);
  };

  const handleEndPointChange = (event) => {
    setEndPoint(event.target.value);
  };

  const filteredRows = dataTrip.filter((row) => {
    const isStartPointMatch =
      !startPoint ||
      row?.routeDTO?.departurePoint
        .toLowerCase()
        .includes(startPoint.toLowerCase());

    const isEndPointMatch =
      !endPoint ||
      row?.routeDTO?.destination.toLowerCase().includes(endPoint.toLowerCase());

    if (!startDate && !endDate) return isStartPointMatch && isEndPointMatch;

    if (!row?.startTimee) return false;

    const rowStartDate = moment(row?.startTimee * 1000)
      .subtract(7, "hours")
      .startOf("day");
    const rowEndDate = moment(row?.startTimee * 1000)
      .subtract(7, "hours")
      .endOf("day");

    if (startDate && endDate) {
      const startMoment = moment(startDate).startOf("day");
      const endMoment = moment(endDate).endOf("day");
      return (
        isStartPointMatch &&
        isEndPointMatch &&
        rowStartDate.isSameOrBefore(endMoment) &&
        rowEndDate.isSameOrAfter(startMoment)
      );
    }

    if (startDate) {
      const startMoment = moment(startDate).startOf("day");
      return (
        isStartPointMatch &&
        isEndPointMatch &&
        rowStartDate.isSameOrAfter(startMoment)
      );
    }

    if (endDate) {
      const endMoment = moment(endDate).endOf("day");
      return (
        isStartPointMatch &&
        isEndPointMatch &&
        rowEndDate.isSameOrBefore(endMoment)
      );
    }

    return isStartPointMatch && isEndPointMatch;
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
          <Grid item xs={4} md={2}>
            <TextField
              id="startPoint"
              label="Điểm Bắt Đầu"
              size="small"
              fullWidth
              value={startPoint}
              onChange={handleStartPointChange}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <TextField
              id="endPoint"
              label="Điểm Kết Thúc"
              size="small"
              fullWidth
              value={endPoint}
              onChange={handleEndPointChange}
            />
          </Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              backgroundImage:
                "linear-gradient(to bottom, #f37106, #f8903b, #fac074, #f8aa85, #fcedc5)",
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
                Điểm Bắt Đầu
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Điểm Kết Thúc
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Giá / 1 vé
              </TableCell>
              {/* <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Tuyến Đường
              </TableCell> */}
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Trạng Thái
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading
              ? filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.idTrip}>
                    <TableCell className="tableCell">{row.idTrip}</TableCell>
                    <TableCell className="tableCell">
                      {moment(row.startTimee * 1000)
                        .subtract(7, "hours")
                        .format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                    <TableCell className="tableCell">
                      {moment(row.endTimee * 1000)
                        .subtract(7, "hours")
                        .format("DD/MM/YYYY hh:mm A")}
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
                    {/* <TableCell className="tableCell">
                      {row.routeDTO.region}
                    </TableCell> */}
                    <TableCell className="tableCell">
                      <span className={`tripRqStatus ${row.adminCheck}`}>
                        {row.adminCheck}
                      </span>
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

export default TripRequestAccept;
