import {
  Box,
  Button,
  Grid,
  Rating,
  Skeleton,
  TableSortLabel,
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
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../../hook/useAuth";
import listTripApi from "../../../utils/listTripAPI";
import MenuActionMyTripCreatedTable from "../../menuAction/menuActionTripTable/menuActionForMyTripCreatedTable";
import CancelTripModel from "../model_popup/trip-managements/modelCancelTrip";
import UpdateTripModal from "../model_popup/trip-managements/modelUpdateTrip";
import "../table.scss";
import useMoneyFormatter from "../../../hook/useMoneyFormatter";

const TripCreatedByStaff = () => {
  const { auth } = useAuth();
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
    setPangination({
      ...pangination,
      pageSize: parseInt(event.target.value, 10),
    });
    console.log("row perpage: ", parseInt(event.target.value, 10));
    setIsLoadAPI(true);
  };

  const [selectedTripData, setSelectedTripData] = useState(null);

  //MODEL UPDATE
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleUpdateModalOpen = (tripData) => {
    setSelectedTripData(tripData);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
  };

  // MODEL BAN
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const handleCancelModelOpen = (tripData) => {
    setSelectedTripData(tripData);
    setCancelModalOpen(true);
  };

  const handleCancelModelClose = () => {
    setCancelModalOpen(false);
  };

  const [dataTrip, setDataTrip] = useState([]);
  const [isLoadAPI, setIsLoadAPI] = useState(true);
  const [loadingTrip, setLoadingTrip] = useState(false);
  const [pangination, setPangination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalPage: 1,
  });

  const fetchTripData = async () => {
    try {
      setLoadingTrip(true);
      const params = {
        staffId: auth.user.idUserSystem,
        pageIndex: pangination?.pageIndex || 1,
        pageSize: pangination?.pageSize || 10,
        totalPage: pangination?.totalPage || 1,
      };
      console.log("hjahahaha", params);
      const response = await listTripApi.getTripByStaffId(params);
      const trips = response.data;
      setDataTrip(trips);
      setPangination({
        pageIndex: response?.pageIndex || 1,
        pageSize: response?.pageSize || 10,
        totalPage: response?.totalPage || 1,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("fetching trip data fail !");
    } finally {
      setLoadingTrip(false);
      setIsLoadAPI(false);
    }
  };
  // }, [isLoadAPI]);
  useEffect(() => {
    if (isLoadAPI) {
      fetchTripData();
    }
  }, [isLoadAPI]);
  //format money
  const [formatMoney] = useMoneyFormatter();

  // SORT STATUS
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSort = () => {
    const isAsc = orderBy === "adminCheck" && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy("adminCheck");
  };

  const sortedData = dataTrip.slice().sort((a, b) => {
    const orderMultiplier = order === "asc" ? 1 : -1;
    const statusOrder = ["ACCEPT", "CANCEL"]; // Định nghĩa thứ tự sắp xếp

    if (statusOrder.indexOf(a.adminCheck) < statusOrder.indexOf(b.adminCheck)) {
      return -1 * orderMultiplier;
    }
    if (statusOrder.indexOf(a.adminCheck) > statusOrder.indexOf(b.adminCheck)) {
      return 1 * orderMultiplier;
    }
    return 0;
  });

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

  if (dataTrip.length >= 0) {
    return (
      <div>
        <Box
          sx={{
            pb: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <TextField
                  id="startPoint"
                  label="Điểm Bắt Đầu"
                  size="small"
                  fullWidth
                  value={startPoint}
                  onChange={handleStartPointChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
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
          <Box>
            <Link to="/create-trip">
              <Button
                variant="contained"
                sx={{
                  zIndex: 1000,
                  bgcolor: "#6D6DFF",
                  ":hover": { bgcolor: "#6868AE" },
                  color: "white",
                }}
              >
                Tạo Chuyến Xe
              </Button>
            </Link>
          </Box>
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
                {/* <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Trạng Thái
                </TableCell> */}
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  <TableSortLabel
                    active={orderBy === "adminCheck"}
                    direction={orderBy === "adminCheck" ? order : "asc"}
                    onClick={handleSort}
                  >
                    Trạng Thái
                  </TableSortLabel>
                </TableCell>

                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Đánh Giá
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loadingTrip && filteredRows.length > 0 ? (
                filteredRows.map((row) => (
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
                        {row.adminCheck === "ACCEPT"
                          ? "CHẤP THUẬN"
                          : row.adminCheck === "PENDING"
                          ? "CHỜ DUYỆT"
                          : row.adminCheck === "CANCEL"
                          ? "HỦY BỎ"
                          : row.adminCheck}
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
                    <TableCell>
                      <MenuActionMyTripCreatedTable
                        tripData={row}
                        onOpenUpdate={handleUpdateModalOpen}
                        onOpenCancel={handleCancelModelOpen}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : !loadingTrip ? (
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
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {selectedTripData && (
              <UpdateTripModal
                open={updateModalOpen}
                handleClose={handleUpdateModalClose}
                tripData={selectedTripData}
              />
            )}

            {selectedTripData && (
              <CancelTripModel
                open={cancelModalOpen}
                handleClose={handleCancelModelClose}
                tripData={selectedTripData}
              />
            )}
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
      </div>
    );
  } else if (loadingTrip) {
    return <div>Loading...</div>;
  }
};
export default TripCreatedByStaff;
