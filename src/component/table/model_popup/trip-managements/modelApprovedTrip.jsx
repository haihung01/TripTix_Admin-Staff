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
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment-timezone";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import listTripApi from "../../../../utils/listTripAPI";
import useMoneyFormatter from "../../../../hook/useMoneyFormatter";

const ModalTripApprovedPopup = ({
  open,
  handleClose,
  tripData,
  fetchListTrip,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [updatedTripData, setUpdatedTripData] = React.useState({
    idTrip: 0,
    adminCheck: "",
  });

  const handleUpdate = async () => {
    try {
      const response = await listTripApi.checkTripByAdmin(updatedTripData);
      console.log("tripU", response);
      fetchListTrip();
      handleClose();
    } catch (error) {
      console.log("errU", error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("update failed !!");
      }
    }
    console.log("datalog", updatedTripData);
  };

  useEffect(() => {
    if (updatedTripData.adminCheck) {
      handleUpdate();
    }
  }, [updatedTripData]);

  //format money
  const [formatMoney] = useMoneyFormatter();

  const handleApprove = () => {
    setUpdatedTripData((prevData) => ({
      ...prevData,
      idTrip: tripData.idTrip,
      adminCheck: "ACCEPTED",
    }));
    toast.success("Accepted successfully !");
  };

  const handleReject = () => {
    const isConfirm = window.confirm("Bạn Thực sự muốn hủy yêu cầu tạo chuyến này ?");
    if (isConfirm) {
      setUpdatedTripData((prevData) => ({
        ...prevData,
        idTrip: tripData.idTrip,
        adminCheck: "CANCELED",
      }));
    }
    toast.success("Cancel successfully !");
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
        Thông tin chi tiết chuyến đi
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label="Nhân Viên Tạo"
              value={tripData?.staffDTO?.fullName}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              fullWidth
              label="ID Chuyến Đi"
              value={tripData?.idTrip}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              fullWidth
              label="Tài Xế"
              value={tripData?.driverDTO?.fullName}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              fullWidth
              label="Tên Xe"
              value={tripData?.busDTO?.name}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              fullWidth
              label="Loại Xe"
              value={tripData?.busDTO?.type}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              fullWidth
              label="Số Chỗ Ngồi"
              value={tripData?.busDTO?.capacity}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              fullWidth
              label="Thời Gian Bắt Đầu"
              value={moment
                .unix(tripData?.startTimee)
                .subtract(7, "hours")
                .format("DD/MM/YYYY - hh:mm A")}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              margin="dense"
              fullWidth
              label="Thời Gian Kết Thúc"
              value={moment
                .unix(tripData?.endTimee)
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
              label="Điểm Bắt Đầu"
              value={tripData?.routeDTO?.departurePoint}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Điểm Kết Thúc"
              value={tripData?.routeDTO?.destination}
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
                  <AccordionDetails sx={{ bgcolor: "whitesmoke" }}>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Địa chỉ: </span>
                      {dataTrip?.stationDTO?.address}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Tỉnh/Thành: </span>
                      {dataTrip?.stationDTO?.province}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Giá Trạm: </span>
                      {formatMoney(dataTrip?.costsIncurred)}
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
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          m: "20px",
        }}
      >
        <Button
          onClick={handleReject} // Set adminCheck to "CANCEL"
          sx={{
            backgroundColor: "white",
            color: "red",
            border: "1px solid red",
            width: "160px",
          }}
        >
          Từ Chối
        </Button>
        <Button
          onClick={handleApprove} // Set adminCheck to "ACCEPT"
          sx={{
            backgroundColor: "#6D6DFF",
            color: "white",
            width: "160px",
            ":hover": { bgcolor: "#6868AE" },
          }}
        >
          Chấp Nhận
        </Button>
      </Box>
    </Dialog>
  );
};

export default ModalTripApprovedPopup;
