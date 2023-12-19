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
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import listUserApi from "../../../utils/listUsersAPI";
import MenuActionStaffTable from "../../menuAction/menuActionUserTable/menuActionForStaffTable";
import BanUserModal from "../model_popup/staff/banModelStaff";
import ModalPopup from "../model_popup/staff/modalPopupStaffDetail";
import AddUserModal from "../model_popup/staff/modelAddStaff";
import UpdateUserModal from "../model_popup/staff/modelUpdateStaff";
import UnbanUserModal from "../model_popup/staff/unbanModelStaff";
import "../table.scss";

const List = () => {
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

  // MODEL DETAIL
  const [open, setOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const handleOpen = (userData) => {
    setSelectedUserData(userData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //MODEL UPDATE
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleUpdateModalOpen = (userData) => {
    setSelectedUserData(userData);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
  };

  // MODEL BAN
  const [banModalOpen, setBanModalOpen] = useState(false);

  const handleBanModelOpen = (userData) => {
    setSelectedUserData(userData);
    setBanModalOpen(true);
  };

  const handleBanModelClose = () => {
    setBanModalOpen(false);
  };

  // MODEL UNBAN
  const [unbanModalOpen, setUnbanModalOpen] = useState(false);

  const handleUnbanModelOpen = (userData) => {
    setSelectedUserData(userData);
    setUnbanModalOpen(true);
  };

  const handleUnbanModelClose = () => {
    setUnbanModalOpen(false);
  };
  // SEARCH STAFF
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };
  // ADD MODEL

  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  // const handleAddUser = (newUser) => {
  //   // Handle adding the new user logic here
  //   console.log("Adding new user:", newUser);
  // };

  const [dataStaff, setDataStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchListUser = async () => {
    try {
      setLoading(true);
      const response = await listUserApi.getAll({
        role: "STAFF",
      });
      console.log("dataTBL", response);
      setDataStaff(response.data);
    } catch (error) {
      console.log("err", error);
      setDataStaff([]);
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
    fetchListUser();
  }, []);

  const filteredRows = dataStaff.filter((row) =>
    row.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ pb: "15px" }}
          label="Tìm Kiếm Theo Tên"
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
          Thêm Nhân Viên
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
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                ID Nhân Viên
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Họ Tên
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Tài Khoản
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Email
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Địa Chỉ
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Trạng Thái
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Giới Tính
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Khu Vực
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.idUserSystem}>
                      <TableCell className="tableCell">
                        {row.idUserSystem}
                      </TableCell>
                      <TableCell
                        className="tableCell"
                        onClick={() => handleOpen(row)}
                      >
                        {row.fullName}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row.userName}
                      </TableCell>
                      <TableCell className="tableCell">{row.email}</TableCell>
                      <TableCell className="tableCell">{row.address}</TableCell>

                      <TableCell className="tableCell">
                        <span className={`staffStatus ${row.status}`}>
                          {row.status === "ACTIVE"
                            ? "ĐANG HOẠT ĐỘNG"
                            : row.status === "DEACTIVE"
                            ? "KHÔNG HOẠT ĐỘNG"
                            : row.status}
                        </span>
                      </TableCell>
                      <TableCell className="tableCell">
                        {row.gender === "MALE"
                          ? "NAM"
                          : row.gender === "FEMALE"
                          ? "NỮ"
                          : row.gender}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row.assignedRegions === "Hỗn hợp"
                          ? "Liên vùng"
                          : row.assignedRegions}
                      </TableCell>

                      <TableCell>
                        <MenuActionStaffTable
                          onOpenUpdate={handleUpdateModalOpen}
                          onOpenDetail={handleOpen}
                          onOpenBan={handleBanModelOpen}
                          onOpenUnban={handleUnbanModelOpen}
                          userData={row}
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
                    <TableCell align="center">
                      <Skeleton variant="rectangular" />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
          {/* Display modal popup */}

          {selectedUserData && (
            <ModalPopup
              open={open}
              handleClose={handleClose}
              userData={selectedUserData}
            />
          )}

          {selectedUserData && (
            <UpdateUserModal
              open={updateModalOpen}
              handleClose={handleUpdateModalClose}
              userData={selectedUserData}
              fetchDataUser={fetchListUser}
            />
          )}

          {selectedUserData && (
            <BanUserModal
              open={banModalOpen}
              handleClose={handleBanModelClose}
              userData={selectedUserData}
              fetchUsersData={fetchListUser}
            />
          )}

          {selectedUserData && (
            <UnbanUserModal
              open={unbanModalOpen}
              handleClose={handleUnbanModelClose}
              userData={selectedUserData}
              fetchUsersData={fetchListUser}
            />
          )}

          <AddUserModal
            open={addModalOpen}
            handleClose={handleAddModalClose}
            fetchUserData={fetchListUser}
          />

          {/* Display modal popup */}
        </Table>

        <TablePagination
          component="div"
          count={dataStaff.length}
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
