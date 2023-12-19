import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment-timezone";
import React from "react";

const ModelDetailTrip = ({ open, handleClose, tripData }) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        textAlign="center"
        variant="h5"
        sx={{
          textTransform: "uppercase",
          color: "#575656",
          backgroundImage:
            "linear-gradient(to bottom, #9b9bff, #a1a1f7, #a7a7ee, #acace5, #b2b2dc)",
        }}
      >
        Chi tiết chuyến đi
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="ID Chuyến Xe"
                    value={tripData?.idTrip}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tài Xế"
                    value={tripData?.driverDTO?.fullName}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Xe Khách"
                    value={tripData?.busDTO?.name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Thời Gian Bắt Đầu"
                    value={moment(tripData.startTimee * 1000)
                      .subtract(7, "hours")
                      .format("DD/MM/YYYY - hh:mm A")}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Thời Gian Kết Thúc"
                    value={moment(tripData.endTimee * 1000)
                      .subtract(7, "hours")
                      .format("DD/MM/YYYY   hh:mm A")}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Điểm Bắt Đầu"
                    value={tripData.routeDTO.departurePoint}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Điểm Kết Thúc"
                    value={tripData.routeDTO.destination}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  {tripData?.listtripStopDTO?.map((dataTrip, index) => (
                    <Box key={index}>
                      <Accordion
                        expanded={expanded === `panel${index + 1}`}
                        onChange={handleChange(`panel${index + 1}`)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <Typography
                            sx={{
                              width: "300px",
                              fontWeight: "bold",
                              color: "grey",
                              flexShrink: 0,
                            }}
                          >
                            {dataTrip?.stationDTO?.name}
                          </Typography>
                          <Typography
                            sx={{ color: "text.secondary" }}
                            textAlign="center"
                          >
                            {dataTrip?.type}
                          </Typography>
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails>
                          <Typography sx={{ mb: 2 }}>
                            <span style={{ fontWeight: 600 }}>Địa chỉ: </span>
                            {dataTrip?.stationDTO?.address}
                          </Typography>
                          <Typography sx={{ mb: 2 }}>
                            <span style={{ fontWeight: 600 }}>
                              Tỉnh/Thành:{" "}
                            </span>
                            {dataTrip?.stationDTO?.province}
                          </Typography>
                          <Typography sx={{ mb: 2 }}>
                            <span style={{ fontWeight: 600 }}>
                              Thời Gian Đến ( Dự Kiến):{" "}
                            </span>
                            {moment(dataTrip?.timeComess * 1000)
                              .subtract(7, "hours")
                              .format("hh:mm A")}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  ))}
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: "2rem",
                }}
              >
                <Rating
                  name={`rating-${tripData.tripID}`}
                  value={tripData.averageStar}
                  precision={0.2}
                  readOnly
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          m: "20px",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "white",
            color: "red",
            border: "1px solid red",
            width: "160px",
          }}
        >
          Đóng
        </Button>
      </Box>
    </Dialog>
  );
};

export default ModelDetailTrip;
