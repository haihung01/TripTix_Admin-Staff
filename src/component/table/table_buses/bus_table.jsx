import SearchIcon from "@mui/icons-material/Search";
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
import { useEffect, useState } from "react";
import DeleteBusModel from "../model_popup/bus/modelDeleteBus";
import ModalDetailBus from "../model_popup/bus/modelDetailBus";
import UpdateBusModal from "../model_popup/bus/modelUpdateBus";
import "../table.scss";
import useAuth from "../../../hook/useAuth";
import listBusesApi from "../../../utils/listBusAPI";
import { toast } from "react-toastify";
import moment from "moment";
import AddBusesPopup from "../model_popup/bus/modelAddBus";
import MenuActionBusTable from "../../menuAction/menuActionBusTable/menuActionForBusTable";

const BusTable = () => {
  const [selectBusData, setSelectBusData] = useState(null);
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

  //SEARCH BY BUS NAME
  const [searchBusName, setSearchBusName] = useState("");

  const handleSearchBusNameChange = (event) => {
    setSearchBusName(event.target.value);
  };

  // BUS DETAIL
  const [open, setOpen] = useState(false);

  const handleOpen = (busData) => {
    setSelectBusData(busData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //MODEL UPDATE
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleUpdateModalOpen = (busData) => {
    setSelectBusData(busData);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
  };

  // MODEL CANCEL
  const [deleteModelOpen, setdeleteModelOpen] = useState(false);

  const handleCancelModelOpen = (busData) => {
    setSelectBusData(busData);
    setdeleteModelOpen(true);
  };

  const handleDeleteBusModel = () => {
    setdeleteModelOpen(false);
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

  const [dataBuses, setDataBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListBus = async () => {
    try {
      setLoading(true);
      const response = await listBusesApi.getAll({});
      console.log("dataTBL", response);
      setDataBuses(response.data);
    } catch (error) {
      console.log("err", error);
      setDataBuses([]);
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
    fetchListBus();
  }, []);

  const filteredRows = dataBuses.filter((row) => {
    // Chuyển đổi selectedDate và createdDate thành đối tượng Date
    const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
    const rowDate = row.createdDate
      ? new Date(`${row.createdDate.split("/").reverse().join("-")}`)
      : null;

    // Kiểm tra xem ngày được chọn có khớp hoặc không hoặc nếu không có tìm kiếm theo tên xe
    const isDateMatch =
      !selectedDateObj ||
      selectedDateObj.toDateString() === rowDate.toDateString();

    // Kiểm tra xem tên xe chứa từ khóa tìm kiếm hoặc không
    const isBusNameMatch =
      !searchBusName ||
      row.name.toLowerCase().includes(searchBusName.toLowerCase());

    // Trả về true nếu cả ngày và tên xe khớp
    return isDateMatch && isBusNameMatch;
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
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <TextField
                id="date"
                label="Chọn Ngày Tạo"
                fullWidth
                size="small"
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                id="busNameSearch"
                label="Tìm Kiếm Tên Xe"
                fullWidth
                size="small"
                value={searchBusName}
                onChange={handleSearchBusNameChange}
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
            Thêm Xe Khách
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
                ID Xe
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Tên Xe
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Loại Xe
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Ngày Tạo
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Ngày Cuối Cập Nhật
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Thuộc Trạm
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Trạng Thái
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading
              ? filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.idBus}>
                      <TableCell className="tableCell">{row.idBus}</TableCell>
                      <TableCell className="tableCell">{row.name}</TableCell>
                      <TableCell className="tableCell">{row.type}</TableCell>
                      <TableCell className="tableCell">
                        {moment(row.createdDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="tableCell">
                        {moment(row.updatedDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="tableCell">
                        <span className={`busStatus ${row.status}`}>
                          {row.status === "ACTIVE"
                            ? "ĐANG HOẠT ĐỘNG"
                            : row.status === "DEACTIVE"
                            ? "KHÔNG HOẠT ĐỘNG"
                            : row.status}
                        </span>
                      </TableCell>
                      <TableCell className="tableCell">
                        <MenuActionBusTable
                          busData={row}
                          onOpenDetail={handleOpen}
                          onOpenUpdate={handleUpdateModalOpen}
                          onOpenDelete={handleCancelModelOpen}
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
          {selectBusData && (
            <ModalDetailBus
              open={open}
              handleClose={handleClose}
              busData={selectBusData}
            />
          )}

          {selectBusData && (
            <UpdateBusModal
              open={updateModalOpen}
              handleClose={handleUpdateModalClose}
              busData={selectBusData}
              fetchListBuses={fetchListBus}
            />
          )}

          {selectBusData && (
            <DeleteBusModel
              open={deleteModelOpen}
              handleClose={handleDeleteBusModel}
              busData={selectBusData}
              fetchBusesData={fetchListBus}
            />
          )}

          <AddBusesPopup
            open={addModalOpen}
            handleClose={handleAddModalClose}
            fetchListbuses={fetchListBus}
          />
        </Table>
        <TablePagination
          component="div"
          count={dataBuses.length}
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

export default BusTable;
