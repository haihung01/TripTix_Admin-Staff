import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import listTripApi from "../../../utils/listTripAPI";
import "./tripDetail.scss";
import Map from "../../mapRenderLocation/renderLocationOnMap";
import { images } from "../../../constants";
import useMoneyFormatter from "../../../hook/useMoneyFormatter";

export default function TripDetail() {
  //*********************
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  //Call API
  const { id } = useParams();
  const [isFetchData, setIsFetchData] = useState(true);
  const [dataTrip, setDataTrip] = useState([]);
  const [busLocation, setBusLocaion] = useState([10.8991, 106.8769]);

  const fetchTripData = useCallback(async () => {
    try {
      const params = { id: parseInt(id) };
      const response = await listTripApi.tripDetail(params);
      const location = response?.data?.busDTO?.location
        ?.split(",")
        ?.map(Number);
      setBusLocaion(location || [10.8991, 106.8769]);
      console.log("list booking: ", response?.data);
      setDataTrip(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("fetching trip data fail !");
    }
  }, [id]);

  useEffect(() => {
    if (isFetchData) {
      fetchTripData();
      setIsFetchData(false);
    }
  }, [fetchTripData, isFetchData]);

  //format money
  const [formatMoney] = useMoneyFormatter();

  const startTimeeFormat = moment(dataTrip?.departureDateLT * 1000)
    .subtract(7, "hours")
    .format("hh:mm A");
  const endTimeeFormat = moment(dataTrip?.endDateLT * 1000)
    .subtract(7, "hours")
    .format("hh:mm A");

  return (
    <div className="trip_detail_container">
      <div className="box box1">
        <Typography
          textAlign="center"
          sx={{
            m: 1,
            mb: 4,
            fontSize: "20px",
            fontWeight: "bold",
            color: "#696969",
          }}
        >
          ༺ Thông Tin Chuyến Đi ༻
        </Typography>
        <Divider />
        <Box sx={{ p: 2, pt: 5 }}>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Tuyến Đường:{" "}
                </span>
                {dataTrip?.route?.name}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Xuất Phát - Kết Thúc:{" "}
                </span>
                {moment(dataTrip?.departureDateLT * 1000)
                  .subtract(7, "hours")
                  .format("DD/MM/YYYY")}{" "}
                -{" "}
                {moment(dataTrip?.endDateLT * 1000)
                  .subtract(7, "hours")
                  .format("DD/MM/YYYY")}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Thời Gian:{" "}
                </span>
                {startTimeeFormat} - {endTimeeFormat}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Tài Xế:{" "}
                </span>
                {dataTrip?.driver?.fullName}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Xe Khách:{" "}
                </span>
                {dataTrip?.vehicle?.name}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Số Lượng Hành Khách:{" "}
                </span>
                {dataTrip?.bookedSeat} /{" "}
                {dataTrip ? dataTrip.bookedSeat + dataTrip.availableSeat : 0}
              </Typography>
            </Grid>
            {/* <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Giá Tiền:{" "}
                </span>
                {formatMoney(dataTrip?.fare)}
              </Typography>
            </Grid> */}
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Trạng Thái:{" "}
                </span>
                <span
                  className="tripStatus"
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    color:
                      dataTrip?.status === "RUN"
                        ? "#6499e9"
                        : dataTrip?.status === "READY"
                        ? "goldenrod"
                        : dataTrip?.status === "FINISH"
                        ? "green"
                        : dataTrip?.status === "CANCEL"
                        ? "red"
                        : "black",
                    backgroundColor:
                      dataTrip?.status === "RUN"
                        ? "rgb(166, 246, 255)"
                        : dataTrip?.status === "READY"
                        ? "rgba(189, 189, 3, 0.103)"
                        : dataTrip?.status === "FINISH"
                        ? "rgba(0, 128, 0, 0.151)"
                        : dataTrip?.status === "CANCEL"
                        ? "rgb(253, 183, 183)"
                        : "white",
                  }}
                >
                  {dataTrip?.status === "READY"
                    ? "CHUẨN BỊ"
                    : dataTrip?.status === "RUN"
                    ? "ĐANG ĐI"
                    : dataTrip?.status === "CANCEL"
                    ? "ĐÃ HỦY"
                    : dataTrip?.status === "FINISH"
                    ? "ĐÃ HOÀN THÀNH"
                    : dataTrip?.status}
                </span>
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography fontSize={20} fontWeight="bold">
                Đánh Giá:{""}
              </Typography>
              <Rating
                name={`rating-${dataTrip?.idTrip}`}
                value={dataTrip?.averageStar || null}
                precision={0.2}
                readOnly
              />
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="box box2">
        <Map position={busLocation} name={dataTrip?.busDTO?.name} />
      </div>
      <div className="box box3">
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography
              textAlign="center"
              sx={{
                m: 1,
                mb: 4,
                fontSize: "20px",
                fontWeight: "bold",
                color: "#696969",
              }}
            >
              ༺ Danh sách trạm xe ༻
            </Typography>
            <Divider />
            {dataTrip?.route?.listStationInRoute?.map((dataTrip, index) => (
              <Box key={index}>
                <Accordion
                  expanded={expanded === `panel${index + 1}`}
                  onChange={handleChange(`panel${index + 1}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ bgcolor: "whiteSmoke" }}
                  >
                    <Typography
                      sx={{
                        width: "300px",
                        fontWeight: "bold",
                        color: "grey",
                        flexShrink: 0,
                      }}
                    >
                      {dataTrip?.station?.name}
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary" }}
                      textAlign="center"
                    >
                      {/* {dataTrip?.type} */}
                    </Typography>
                  </AccordionSummary>
                  <Divider />
                  <AccordionDetails>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Địa chỉ: </span>
                      {dataTrip?.station?.address}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Tỉnh/Thành: </span>
                      {dataTrip?.station?.province}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>
                        Thời Gian Đến (Dự Kiến):{" "}
                      </span>
                      {dataTrip?.timeCome}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Khoảng cách: </span>
                      {dataTrip?.distance} Km
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))}
          </Grid>
        </Grid>
      </div>
      <div className="box box5">
        {" "}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography
              textAlign="center"
              sx={{
                m: 1,
                mb: 4,
                fontSize: "20px",
                fontWeight: "bold",
                color: "#696969",
              }}
            >
              ༺ Danh sách Loại Vé ༻
            </Typography>
            <Divider />
            {dataTrip?.route?.listTicketType !== "" ? (
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
                        sx={{ color: "#443A3E", fontWeight: "bold" }}
                      >
                        ID Loại vé
                      </TableCell>
                      <TableCell
                        className="tableCell"
                        sx={{ color: "#443A3E", fontWeight: "bold" }}
                      >
                        Loại vé
                      </TableCell>
                      <TableCell
                        className="tableCell"
                        sx={{ color: "#443A3E", fontWeight: "bold" }}
                      >
                        Giá vé
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataTrip?.route?.listTicketType?.map((row) => (
                      <TableRow key={row.idTicketType}>
                        <TableCell className="tableCell">
                          {row.idTicketType}
                        </TableCell>
                        <TableCell className="tableCell">{row.name}</TableCell>
                        <TableCell className="tableCell">
                          {formatMoney(row.defaultPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div>
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
                          sx={{ color: "#443A3E", fontWeight: "bold" }}
                        >
                          ID Loại vé
                        </TableCell>
                        <TableCell
                          className="tableCell"
                          sx={{ color: "#443A3E", fontWeight: "bold" }}
                        >
                          Loại vé
                        </TableCell>
                        <TableCell
                          className="tableCell"
                          sx={{ color: "#443A3E", fontWeight: "bold" }}
                        >
                          Giá vé
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ textAlign: "center", fontSize: "18px", m: 1 }}
                  >
                    Chưa có Loại vé cho tuyến đường này !
                  </Typography>
                </Box>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
      <div className="box box4">
        {dataTrip?.tickets?.length > 0 ? (
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
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    ID vé
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    Khách hàng
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    Số điện thoại
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    Chỗ ngồi
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    Tổng giá
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    Điểm đón
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    Điểm trả
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell
                    className="tableCell"
                    sx={{ color: "#443A3E", fontWeight: "bold" }}
                  >
                    Đánh Giá
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTrip?.tickets?.map((row) => (
                  <TableRow key={row.idTicket}>
                    <TableCell className="tableCell">{row.idTicket}</TableCell>
                    <TableCell className="tableCell">{row?.fullName}</TableCell>
                    <TableCell className="tableCell">{row?.phone}</TableCell>
                    <TableCell className="tableCell">{row?.seatName}</TableCell>
                    <TableCell className="tableCell">
                      {formatMoney(row?.price)}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row?.onStation?.name}
                    </TableCell>
                    <TableCell className="tableCell">
                      {row?.offStation?.name}
                    </TableCell>
                    <TableCell className="tableCell">
                      <span className={`status ${row.status}`}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="tableCell">
                      <Rating
                        name={`rating-${row.idTicket}`}
                        value={row?.star || null}
                        precision={0.2}
                        readOnly
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div>
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
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      ID vé
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      Khách hàng
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      Số điện thoại
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      Chỗ ngồi
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      Tổng giá
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      Điểm đón
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      Điểm trả
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      className="tableCell"
                      sx={{ color: "#443A3E", fontWeight: "bold" }}
                    >
                      Đánh Giá
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={images.noDataImg}
                alt="noDataImg.png"
                style={{ Height: "8vh", width: "8vw" }}
              />
              <Typography sx={{ textAlign: "center", fontSize: "18px", m: 1 }}>
                Chưa có khách hàng nào đặt chuyến này.
              </Typography>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}
