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
import ModelDetailNews from "../model_popup/news/modelDetailNews";
import { useEffect, useState } from "react";
import "./../table.scss";
import ModelUpdateNews from "../model_popup/news/modelUpdateNews";
import ModelDeleteNews from "../model_popup/news/modelDeleteNews";
import useAuth from "../../../hook/useAuth";
import { toast } from "react-toastify";
import listNewsApi from "../../../utils/listNewsAPI";
import moment from "moment";
import AddNewsPopup from "../model_popup/news/modelAddNews";
import MenuActionNewsTable from "../../menuAction/menuActionNewsTable/menuActionForNewsTable";

const List = () => {
  const [selectNewsData, setSelectNewsData] = useState(null);
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

  // Search NEWS
  const [searchTitle, setSearchTitle] = useState("");

  const handleSearchTitleChange = (event) => {
    setSearchTitle(event.target.value);
  };

  // NEWS DETAIL
  const [open, setOpen] = useState(false);

  const handleOpen = (newsData) => {
    setSelectNewsData(newsData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //MODEL UPDATE
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleUpdateModalOpen = (newsData) => {
    setSelectNewsData(newsData);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
  };

  // MODEL DELETE NEWS
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);

  const handleDeleteModelOpen = (newsData) => {
    setSelectNewsData(newsData);
    setDeleteModelOpen(true);
  };

  const handleDeleteModelClose = () => {
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

  const [dataNews, setDataNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListNews = async () => {
    try {
      setLoading(true);
      const response = await listNewsApi.getAll({});
      console.log("dataTBL", response);
      setDataNews(response.data);
    } catch (error) {
      console.log("err", error);
      setDataNews([]);
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
    fetchListNews();
  }, []);

  // FILTER BY DATE
  const [startDate, setStartDate] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const filteredRows = dataNews.filter((row) => {
    // Convert selectedDate and createdDate to JavaScript Date objects
    const startDateObj = startDate ? new Date(startDate) : null;

    const rowDate = row.createdDate
      ? new Date(`${row.createdDate.split("/").reverse().join("-")}`)
      : null;

    // Check if the row date is within the selected date range
    const isDateInRange = !startDateObj || rowDate >= startDateObj;

    // Check if the title matches the search query
    const isTitleMatch =
      !searchTitle ||
      row.title.toLowerCase().includes(searchTitle.toLowerCase());

    return isDateInRange && isTitleMatch;
  });

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
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={6} md={6}>
              <TextField
                id="date"
                label="Tìm Kiếm Ngày Tạo"
                fullWidth
                size="small"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                sx={{ ml: "20px" }}
                id="title"
                fullWidth
                size="small"
                label="Tìm Kiếm Tiêu Đề "
                value={searchTitle}
                onChange={handleSearchTitleChange}
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
        {auth?.user?.role === "ROLE_STAFF" && (
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
            Thêm Tin Tức
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
                ID Tin Tức
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                ID Nhân Viên
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Tiêu Đề
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Ngày Tạo
              </TableCell>
              <TableCell className="tableTitle" sx={{ color: "#443A3E" }}>
                Ngày Cập Nhật
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading
              ? filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.idNews}>
                      <TableCell className="tableCell">{row.idNews}</TableCell>
                      <TableCell className="tableCell">{row.idStaff}</TableCell>
                      <TableCell className="tableCell">{row.title}</TableCell>
                      <TableCell className="tableCell">
                        {moment(row.createdDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="tableCell">
                        {moment(row.updatedDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        <MenuActionNewsTable
                          newsData={row}
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
          {selectNewsData && (
            <ModelDetailNews
              open={open}
              handleClose={handleClose}
              newsData={selectNewsData}
            />
          )}

          {selectNewsData && (
            <ModelUpdateNews
              open={updateModalOpen}
              handleClose={handleUpdateModalClose}
              newsData={selectNewsData}
              fetchListNews={fetchListNews}
            />
          )}

          {selectNewsData && (
            <ModelDeleteNews
              open={deleteModelOpen}
              handleClose={handleDeleteModelClose}
              newsData={selectNewsData}
              fetchNewsData={fetchListNews}
            />
          )}

          <AddNewsPopup
            open={addModalOpen}
            handleClose={handleAddModalClose}
            fetchListNews={fetchListNews}
          />
        </Table>
        <TablePagination
          component="div"
          count={dataNews.length}
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
