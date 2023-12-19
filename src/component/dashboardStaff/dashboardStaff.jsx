import {
  Box,
  Grid,
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
import { toast } from "react-toastify";
import listTripApi from "../../utils/listTripAPI";
import "../table/table.scss";

const DashboardStaff = () => {
  // PAGINATION
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10); // Đặt giá trị mặc định là 10 hoặc số hàng tùy ý
  const rowsPerPageOptions = [5, 10, 20, 30, 50];

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
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
  const [loadingTrip, setLoadingTrip] = useState(false);
  const [isLoadAPI, setIsLoadAPI] = useState(true);
  const [pangination, setPangination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalPage: 1,
  });

  const fetchListTrip = async () => {
    try {
      setLoadingTrip(true);
      const response = await listTripApi.getTripByAdminCheckAccept(pangination);
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

  const filteredRows = sortedData.filter((row) => {
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
    <Box>
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
        <Table sx={{ minWidth: "60vw" }} aria-label="simple table">
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
                Điểm Bắt Đầu
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Điểm Kết Thúc
              </TableCell>
              {/* <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Khu Vực
              </TableCell> */}
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={handleSort}
                >
                  Trạng Thái
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loadingTrip
              ? filteredRows &&
              filteredRows.map((row) => (
                <TableRow key={row.idTrip}>
                  <TableCell className="tableCell">{row.idTrip}</TableCell>
                  <TableCell className="tableCell">
                    {moment(row.startTimee * 1000).format(
                      "DD/MM/YYYY - hh:mm A"
                    )}
                  </TableCell>
                  <TableCell className="tableCell">
                    {moment(row.endTimee * 1000).format(
                      "DD/MM/YYYY - hh:mm A"
                    )}
                  </TableCell>
                  <TableCell className="tableCell">
                    {row.routeDTO.departurePoint}
                  </TableCell>
                  <TableCell className="tableCell">
                    {row.routeDTO.destination}
                  </TableCell>
                  {/* <TableCell className="tableCell">
                      {row.routeDTO.region}
                    </TableCell> */}
                  <TableCell className="tableCell">
                    <span className={`tripStatus ${row.status}`}>
                      {row.status === "RUN"
                        ? "ĐANG ĐI"
                        : row.status === "READY"
                          ? "CHUẨN BỊ"
                          : row.status === "CANCEL"
                            ? "HỦY BỎ"
                            : row.status === "FINISH"
                              ? "ĐÃ HOÀN THÀNH"
                              : row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
              : [0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          // count={dataTrip.length}
          // page={page}
          count={pangination.totalPage * pangination.pageSize}
          page={pangination.pageIndex - 1}
          onPageChange={handleChangePage}
          // rowsPerPage={rowsPerPage}
          rowsPerPage={pangination.pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </TableContainer>
    </Box>
  );
};

export default DashboardStaff;
