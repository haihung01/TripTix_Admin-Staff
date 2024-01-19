import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import listRouteApi from "../../../utils/listRouteAPI";
import "./routeDetail.scss";
import useMoneyFormatter from "../../../hook/useMoneyFormatter";

export default function RouteDetail() {
  //*********************
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  //Call API
  const { id } = useParams();
  const [isFetchData, setIsFetchData] = useState(true);
  const [routeData, setRouteData] = useState([]);

  const fetchTripData = useCallback(async () => {
    try {
      const params = { id: parseInt(id) };
      const response = await listRouteApi.routeDetail(params);
      setRouteData(response.data);
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

  return (
    <div className="station_detail_container">
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
          ༺ Thông Tin Tuyến Đường ༻
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
                {routeData?.name}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Tỉnh/Thành Phố:{" "}
                </span>
                {routeData?.province}
              </Typography>
            </Grid>
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
                      routeData?.status === "ACTIVE"
                        ? "green"
                        : routeData?.status === "DEACTIVE"
                        ? "red"
                        : "black",
                    backgroundColor:
                      routeData?.status === "ACTIVE"
                        ? "rgba(0, 128, 0, 0.151)"
                        : routeData?.status === "DEACTIVE"
                        ? "rgb(253, 183, 183)"
                        : "white",
                  }}
                >
                  {routeData?.status === "DEACTIVE"
                    ? "NGƯNG HOẠT ĐỘNG"
                    : routeData?.status === "ACTIVE"
                    ? "ĐANG HOẠT ĐỘNG"
                    : routeData?.status}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="box box2">
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
            {routeData?.listStationInRoute?.map((routeData, index) => (
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
                      {routeData?.station?.name}
                    </Typography>
                  </AccordionSummary>
                  <Divider />
                  <AccordionDetails>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Địa chỉ: </span>
                      {routeData?.station?.address}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Tỉnh/Thành: </span>
                      {routeData?.station?.province}
                    </Typography>
                    <Typography>
                      <span style={{ fontWeight: 600 }}>Trạng Thái: </span>
                      <span
                        className="tripStatus"
                        style={{
                          padding: "5px",
                          borderRadius: "5px",
                          color:
                            routeData?.station?.status === "ACTIVE"
                              ? "green"
                              : routeData?.station?.status === "DEACTIVE"
                              ? "red"
                              : "black",
                          backgroundColor:
                            routeData?.station?.status === "ACTIVE"
                              ? "rgba(0, 128, 0, 0.151)"
                              : routeData?.station?.status === "DEACTIVE"
                              ? "rgb(253, 183, 183)"
                              : "white",
                        }}
                      >
                        {routeData?.station?.status === "DEACTIVE"
                          ? "NGƯNG HOẠT ĐỘNG"
                          : routeData?.station?.status === "ACTIVE"
                          ? "ĐANG HOẠT ĐỘNG"
                          : routeData?.station?.status}
                      </span>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            ))}
          </Grid>
        </Grid>
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
              ༺ Danh sách Loại Vé ༻
            </Typography>
            <Divider />
            {routeData?.listTicketType !== "" ? (
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
                    {routeData?.listTicketType?.map((row) => (
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
    </div>
  );
}
