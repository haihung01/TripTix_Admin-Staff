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
import { toast } from "react-toastify";
import configSystemApi from "../../utils/ConfigSystemAPI";
import "../table/table.scss";
import ModelDetailService from "../table/model_popup/serviceSystem/modelDetailServicePopup";
import ModelUpdateService from "../table/model_popup/serviceSystem/modelUpdateServicePopup";
import AddServicePopup from "../table/model_popup/serviceSystem/modelAddServicePopup";
import ModelDeleteService from "../table/model_popup/serviceSystem/modelDeleteServicePopup";
import MenuActionConfigServiceTable from "../menuAction/menuActionConfigServiceTable/menuActionForConfigServiceTable";

const ListSystemService = () => {
  const [selectServiceData, setSelectServiceData] = useState(null);

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

  // SERVICE DETAIL
  const [open, setOpen] = useState(false);

  const handleOpen = (serviceData) => {
    setSelectServiceData(serviceData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //MODEL UPDATE
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleUpdateModalOpen = (serviceData) => {
    setSelectServiceData(serviceData);
    setUpdateModalOpen(true);
  };
  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
  };

  // ADD MODEL

  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  // MODEL DELETE SERVICE
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);

  const handleDeleteModelOpen = (serviceData) => {
    setSelectServiceData(serviceData);
    setDeleteModelOpen(true);
  };

  const handleDeleteModelClose = () => {
    setDeleteModelOpen(false);
  };

  // SEARCH SERVICE
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  //CALL API AND SET LOADING
  const [dataServiceSystem, setDataServiceSystem] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListService = async () => {
    try {
      setLoading(true);
      const response = await configSystemApi.getAll();
      console.log("dataTBL", response);
      setDataServiceSystem(response.data);
    } catch (error) {
      console.log("err", error);
      setDataServiceSystem([]);
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
    fetchListService();
  }, []);

  const filteredRows = dataServiceSystem.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: "20px",
        }}
      >
        <TextField
          label="Tìm Kiếm Tên Dịch Vụ"
          size="small"
          variant="outlined"
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          sx={{
            zIndex: 1000,
            bgcolor: "#6D6DFF",
            ":hover": { bgcolor: "#6868AE" },
            color: "white",
          }}
          onClick={handleAddModalOpen}
        >
          Thêm Dịch Vụ
        </Button>
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
              <TableCell
                className="tableCell"
                sx={{ color: "#443A3E", fontWeight: "bolder" }}
              >
                ID Dịch vụ
              </TableCell>
              <TableCell
                className="tableCell"
                sx={{ color: "#443A3E", fontWeight: "bolder" }}
              >
                Tên dịch vụ ( loại )
              </TableCell>
              <TableCell
                className="tableCell"
                sx={{ color: "#443A3E", fontWeight: "bolder" }}
              >
                Giá trị
              </TableCell>
              <TableCell
                className="tableCell"
                sx={{ color: "#443A3E" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading
              ? filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.idConfigSystem}>
                      <TableCell className="tableCell">
                        {row.idConfigSystem}
                      </TableCell>
                      <TableCell className="tableCell">{row.name}</TableCell>
                      <TableCell className="tableCell">{row.value}</TableCell>
                      <TableCell className="tableCell">
                        <MenuActionConfigServiceTable
                          serviceData={row}
                          onOpenDetail={handleOpen}
                          onOpenUpdate={handleUpdateModalOpen}
                          onOpenDelete={handleDeleteModelOpen}
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
                  </TableRow>
                ))}
          </TableBody>
          {selectServiceData && (
            <ModelDetailService
              open={open}
              handleClose={handleClose}
              serviceData={selectServiceData}
            />
          )}

          {selectServiceData && (
            <ModelUpdateService
              open={updateModalOpen}
              handleClose={handleUpdateModalClose}
              serviceData={selectServiceData}
              fetchListServices={fetchListService}
            />
          )}

          {selectServiceData && (
            <ModelDeleteService
              open={deleteModelOpen}
              handleClose={handleDeleteModelClose}
              serviceData={selectServiceData}
              fetchServicesData={fetchListService}
            />
          )}

          <AddServicePopup
            open={addModalOpen}
            handleClose={handleAddModalClose}
            fetchListServices={fetchListService}
          />
        </Table>
        <TablePagination
          component="div"
          count={dataServiceSystem.length}
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

export default ListSystemService;
