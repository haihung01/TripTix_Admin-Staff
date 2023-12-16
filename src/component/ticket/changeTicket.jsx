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
          label="Search by Full Name"
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
          label="Search by Phone Number"
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
            <TableHead>
              <TableRow>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Customer ID
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Full Name
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Email
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Address
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Phone Number
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Status
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Gender
                </TableCell>
                <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                  Last Update
                </TableCell>
                <TableCell
                  className="tableTitle"
                  sx={{ color: "#443A3E" }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
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
                      <div className="cellWrapper">
                        <img src={row.img} alt="" className="image" />
                        {row.fullName}
                      </div>
                    </TableCell>
                    <TableCell className="tableCell" sx={{ width: "100px" }}>
                      {row.email}
                    </TableCell>
                    <TableCell className="tableCell" sx={{ width: "220px" }}>
                      {row.address}
                    </TableCell>
                    <TableCell className="tableCell" sx={{ width: "220px" }}>
                      {row.phone}
                    </TableCell>
                    <TableCell className="tableCell">
                      <span className={`staffStatus ${row.status}`}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="tableCell">{row.gender}</TableCell>
                    <TableCell className="tableCell" sx={{ width: "220px" }}>
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
