import SearchIcon from "@mui/icons-material/Search";
import { IconButton, TablePagination, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment/moment";
import listUserApi from "../../utils/listUsersAPI";
import MenuActionCustomerTable from "../menuAction/menuActionUserTable/menuActionForCustomerTable";
import ModalPopup from "../table/model_popup/customer/customerModelDetail";
import "../table/table.scss";

const ChangeTicket = () => {
  // PAGINATION
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 15, 20]; // Đặt giá trị mặc định là 5 hoặc số hàng tùy ý

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // SEARCH Full Name
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // SEARCH Phone
  const [searchPhone, setSearchPhone] = useState("");

  const handleSearchPhone = (event) => {
    const inputValue = event.target.value;
    // Sử dụng biểu thức chính quy để kiểm tra xem giá trị có phải là số hay không
    if (/^[0-9]*$/.test(inputValue)) {
      setSearchPhone(inputValue);
    }
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

  useEffect(() => {
    const fetchListUser = async () => {
      try {
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
      }
    };
    fetchListUser();
  }, []);

  const filteredRows = dataCustomer.filter((row) => {
    return (
      row.fullName.toLowerCase().includes(searchText.toLowerCase()) &&
      row.phone.toLowerCase().includes(searchPhone.toLowerCase())
    );
  });

  if (dataCustomer.length > 0) {
    return (
      <div>
        <TextField
          sx={{ pb: "15px" }}
          label="Tìm kiếm theo tên"
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
        <TextField
          sx={{ pb: "15px", ml: "20px" }}
          label="Tìm kiếm theo số điện thoại"
          size="small"
          variant="outlined"
          value={searchPhone}
          onChange={handleSearchPhone}
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
              textAlign="center"
              variant="h5"
              sx={{
                textTransform: "uppercase",
                color: "#575656",
                backgroundImage:
                  "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
              }}
            >
              <TableRow>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  ID khách hàng
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Họ Tên
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Email
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Địa Chỉ
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Số Điện Thoại
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  trạng Thái
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Giới Tính
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Ngày Cuối Cập Nhật
                </TableCell>
                <TableCell
                  className="tableTitle"
                  sx={{ color: "#443A3E" }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.idUserSystem}>
                    <TableCell className="tableCell">
                      {row.idUserSystem}
                    </TableCell>
                    <TableCell className="tableCell">{row.fullName}</TableCell>
                    <TableCell className="tableCell">{row.email}</TableCell>
                    <TableCell className="tableCell">{row.address}</TableCell>
                    <TableCell className="tableCell">{row.phone}</TableCell>
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
                        : row.status}
                    </TableCell>
                    <TableCell className="tableCell">
                      {moment(row.updatedDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      <MenuActionCustomerTable
                        onOpenDetail={handleOpen}
                        userData={row}
                      />
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
  } else {
    return <div>loading</div>;
  }
};

export default ChangeTicket;
