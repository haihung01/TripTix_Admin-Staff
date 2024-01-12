import SearchIcon from "@mui/icons-material/Search";
import {
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
import listUserApi from "../../../utils/listUsersAPI";
import MenuActionCustomerTable from "../../menuAction/menuActionUserTable/menuActionForCustomerTable";
import ModalPopup from "../model_popup/customer/customerModelDetail";
import "../table.scss";

const Listcustomer = () => {
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

  // SEARCH STAFF
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
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

  // DATA API
  const [dataCustomer, setDataCustomer] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListUser = async () => {
      try {
        setLoading(true);
        const response = await listUserApi.getAll({
          role: "CUSTOMER",
        });
        console.log("dataTBL", response);
        setDataCustomer(response.data);
      } catch (error) {
        console.log("err", error);
        setDataCustomer([]);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Load Data failed !");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchListUser();
  }, []);

  const filteredRows = dataCustomer.filter((row) =>
    row.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
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
                ID Khách hàng
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
                      <TableCell className="tableCell">
                        {row.fullName}
                      </TableCell>
                      <TableCell className="tableCell" sx={{ width: "100px" }}>
                        {row.userName}
                      </TableCell>
                      <TableCell className="tableCell" sx={{ width: "100px" }}>
                        {row.email}
                      </TableCell>
                      <TableCell className="tableCell" sx={{ width: "220px" }}>
                        {row.address}
                      </TableCell>
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
                        <MenuActionCustomerTable
                          onOpenDetail={handleOpen}
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
          {/* Display modal popup */}
        </Table>
        <TablePagination
          component="div"
          count={dataCustomer.length}
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

export default Listcustomer;
