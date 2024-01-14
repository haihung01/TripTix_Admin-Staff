import {
  Box,
  Grid,
  Rating,
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
import MenuActionTripFinishTable from "../../menuAction/menuActionTripTable/menuActionForTripFinishTable";
import "../table.scss";

const TripFinishList = () => {
  // PAGINATION
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5, 10, 25, 50]; // Đặt giá trị mặc định là 5 hoặc số hàng tùy ý

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    setPangination({ ...pangination, pageIndex: newPage + 1 });
    setIsLoadAPI(true);
    console.log("new page: ", newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    // setRowsPerPage(parseInt(event.target.value, 10));
    // setPage(0);
    // setRowsPerPage(parseInt(event.target.value, 10));
    // setPage(0);
    setPangination({
      ...pangination,
      pageSize: parseInt(event.target.value, 10),
    });
    console.log("row perpage: ", parseInt(event.target.value, 10));
    setIsLoadAPI(true);
  };

  const [dataTrip, setDataTrip] = useState([]);
  const [isLoadAPI, setIsLoadAPI] = useState(true);
  const [loadingTrip, setLoadingTrip] = useState(false);
  const [pangination, setPangination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalPage: 1,
  });

  const fetchListTrip = async () => {
    try {
      setLoadingTrip(true);
      const response = await listTripApi.getTripFinish(pangination);
      console.log("dataTBL", response);
      setDataTrip(response.data);
      setPangination({
        pageIndex: response?.pageIndex || 1,
        pageSize: response?.pageSize || 10,
        totalPage: response?.totalPage || 1,
      });
    } catch (error) {
      console.log("err", error);
      setDataTrip([]);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Load Data failed !");
      }
    } finally {
      setLoadingTrip(false);
      setIsLoadAPI(false);
    }
  };

  useEffect(() => {
    if (isLoadAPI) {
      fetchListTrip();
    }
  }, [isLoadAPI]);


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
      row?.route?.departurePoint
        .toLowerCase()
        .includes(startPoint.toLowerCase());

    const isEndPointMatch =
      !endPoint ||
      row?.route?.destination.toLowerCase().includes(endPoint.toLowerCase());

    if (!startDate && !endDate) return isStartPointMatch && isEndPointMatch;

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
                "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
            }}
          >
            <TableRow>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                ID Chuyến Xe
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
                Trạng Thái
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Số Lương Hành Khách
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Đánh Giá
              </TableCell>
              <TableCell className="tableCell"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loadingTrip
              ? filteredRows &&
                filteredRows.map((row) => (
                  <TableRow key={row.idTrip}>
                    <TableCell className="tableCell">{row?.idTrip}</TableCell>
                    <TableCell className="tableCell">
                      {moment(row?.departureDateLT * 1000)
                        .subtract(7, "hours")
                        .format("DD/MM/YYYY - hh:mm A")}
                    </TableCell>
                    <TableCell className="tableCell">
                      {moment(row?.endDateLT * 1000)
                        .subtract(7, "hours")
                        .format("DD/MM/YYYY - hh:mm A")}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row?.route?.departurePoint}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row?.route?.destination}
                    </TableCell>

                    <TableCell className="tableCell">
                      <span className={`tripStatus ${row?.status}`}>
                        ĐÃ HOÀN THÀNH
                      </span>
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center" }}
                      className="tableCell"
                    >
                      {row?.bookedSeat} /{" "}
                      {row ? row.bookedSeat + row.availableSeat : 0}
                    </TableCell>
                    <TableCell className="tableCell">
                      <Rating
                        name={`rating-${row?.tripID}`}
                        value={row?.averageStar}
                        precision={0.2}
                        readOnly
                      />
                    </TableCell>
                    <TableCell className="tableCell">
                      <MenuActionTripFinishTable tripData={row} />
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
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pangination.totalPage * pangination.pageSize}
          page={pangination.pageIndex - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pangination.pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </TableContainer>
    </div>
  );
};

export default TripFinishList;
