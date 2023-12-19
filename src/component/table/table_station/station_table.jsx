import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
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
import { useEffect, useState } from "react";
import DeleteStationModel from "../model_popup/station/modelDeleteStation";
import UpdateStationModal from "../model_popup/station/modelUpdateStation";
import "../table.scss";
import listStationApi from "../../../utils/listStationAPI";
import useAuth from "../../../hook/useAuth";
import { toast } from "react-toastify";
import moment from "moment";
import AddStationPopup from "../model_popup/station/modelAddStation";
import MenuActionStationTable from "../../menuAction/menuActionStationTable/menuActionForStationTable";

const List = () => {
  const { auth } = useAuth();
  // PAGINATION
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5, 10, 15, 20]; // Đặt giá trị mặc định là 5 hoặc số hàng tùy ý

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [selectStationData, setSelectStationData] = useState(null);

  //MODEL UPDATE
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleUpdateModalOpen = (stationData) => {
    setSelectStationData(stationData);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
  };

  // MODEL DELETE
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);

  const handleDeleteModelOpen = (stationData) => {
    setSelectStationData(stationData);
    setDeleteModelOpen(true);
  };

  const handleCancelModelClose = () => {
    setDeleteModelOpen(false);
  };

  // ADD MODEL

  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  // FILTER BY DATE
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Search station
  const [searchStationName, setSearchStationName] = useState("");

  const handleSearchStationNameChange = (event) => {
    setSearchStationName(event.target.value);
  };

  // Search Provice
  const [searchProvince, setSearchProvince] = useState("");

  const handleSearchProvinceChange = (event) => {
    setSearchProvince(event.target.value);
  };

  const [dataStation, setDataStation] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListStation = async () => {
    try {
      setLoading(true);
      const response = await listStationApi.getAll({});
      console.log("dataTBL", response);
      setDataStation(response.data);
    } catch (error) {
      console.log("err", error);
      setDataStation([]);
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
    fetchListStation();
  }, []);

  const filteredRows = dataStation?.filter((row) => {
    // Kiểm tra xem ngày được chọn có khớp hoặc không
    const isDateMatch =
      !selectedDate ||
      !row.createdDate ||
      (() => {
        const selectedDateObj = new Date(selectedDate);
        const rowDateParts = moment(row.createdDate)
          .format("DD/MM/YYYY")
          .split("/");
        const rowDate = new Date(
          `${rowDateParts[2]}-${rowDateParts[1]}-${rowDateParts[0]}`
        );
        return selectedDateObj.toDateString() === rowDate.toDateString();
      })();
    // Kiểm tra xem tên trạm có khớp với dữ liệu hay không

    const isStationNameMatch =
      !searchStationName ||
      (row.name &&
        row.name.toLowerCase().includes(searchStationName.toLowerCase()));

    // Kiểm tra xem tỉnh có khớp với dữ liệu hay không
    const isProvinceMatch =
      !searchProvince ||
      (row.province &&
        row.province.toLowerCase().includes(searchProvince.toLowerCase()));

    return isDateMatch && isStationNameMatch && isProvinceMatch;
  });

  return (
    <div>
      <Box
        sx={{
          pb: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <TextField
            id="date"
            label="Chọn Ngày Tạo"
            size="small"
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            sx={{ ml: "20px" }}
            id="stationName"
            label="Tìm Kiếm Trạm"
            size="small"
            value={searchStationName}
            onChange={handleSearchStationNameChange}
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
            id="province"
            label="Tìm Kiếm Tỉnh"
            size="small"
            value={searchProvince}
            onChange={handleSearchProvinceChange}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
        {auth?.user?.role === "ROLE_ADMIN" && (
          <Button
            variant="contained"
            sx={{
              zIndex: 1000,

              backgroundColor: "#6D6DFF",

              ":hover": { bgcolor: "#6868AE" },

              color: "white",
            }}
            onClick={handleAddModalOpen}
          >
            Thêm Trạm
          </Button>
        )}
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
                ID Trạm
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Tên Trạm
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Tỉnh/Thành
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Địa Chỉ
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Ngày Tạo
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Ngày Cuối Cập Nhật
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Trạng Thái
              </TableCell>
              {auth?.user?.role === "ROLE_ADMIN" && (
                <TableCell className="tableCell"></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading
              ? filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.idStation}>
                      <TableCell className="tableCell">
                        {row.idStation}
                      </TableCell>
                      <TableCell className="tableCell">{row.name}</TableCell>
                      <TableCell className="tableCell">
                        {row.province}
                      </TableCell>
                      <TableCell className="tableCell">{row.address}</TableCell>
                      <TableCell className="tableCell">
                        {moment(row.createdDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="tableCell">
                        {moment(row.updatedDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="tableCell">
                        <span className={`stationStatus ${row.status}`}>
                          {row.status === "ACTIVE"
                            ? "ĐANG HOẠT ĐỘNG"
                            : row.status === "DEACTIVE"
                            ? "KHÔNG HOẠT ĐỘNG"
                            : row.status}
                        </span>
                      </TableCell>
                      {auth?.user?.role === "ROLE_ADMIN" && (
                        <TableCell>
                          <MenuActionStationTable
                            stationData={row}
                            onOpenUpdate={handleUpdateModalOpen}
                            onOpenDelete={handleDeleteModelOpen}
                          />
                        </TableCell>
                      )}
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
                    {auth?.user?.role === "ROLE_ADMIN" && (
                      <TableCell align="center">
                        <Skeleton variant="rectangular" />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
          </TableBody>
          {selectStationData && (
            <UpdateStationModal
              open={updateModalOpen}
              handleClose={handleUpdateModalClose}
              stationData={selectStationData}
              fetchListStation={fetchListStation}
            />
          )}

          {selectStationData && (
            <DeleteStationModel
              open={deleteModelOpen}
              handleClose={handleCancelModelClose}
              stationData={selectStationData}
              fetchStationsData={fetchListStation}
            />
          )}

          <AddStationPopup
            open={addModalOpen}
            handleClose={handleAddModalClose}
            fetchListStation={fetchListStation}
          />
        </Table>
        <TablePagination
          component="div"
          count={dataStation.length}
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
