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
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import listTripApi from "../../../../utils/listTripAPI";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useMoneyFormatter from "../../../../hook/useMoneyFormatter";

const ModalTripApprovedPopup = ({
  open,
  handleClose,
  tripData,
  fetchListTrip,
  listScheduleData,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  console.log("test6tripData", tripData);

  const [listSchedule, setListSchedule] = useState(listScheduleData || []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [updatedTripData, setUpdatedTripData] = React.useState({
    idTrip: 0,
    adminCheck: "",
  });

  useEffect(() => {
    setListSchedule(listScheduleData || []);
  }, [listScheduleData]);

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
      listIdTripSchedule: listSchedule.map((s) => s.idTrip) || [],
    }));
    toast.success("Chấp nhận thành công!");
  };

  const handleReject = () => {
    const isConfirm = window.confirm(
      "Bạn Thực sự muốn hủy yêu cầu tạo chuyến này ?"
    );
    if (isConfirm) {
      setUpdatedTripData((prevData) => ({
        ...prevData,
        idTrip: tripData.idTrip,
        adminCheck: "CANCELED",
      }));
    }
    toast.success("Từ chối thành công!");
  };

  const handleDelete = (schedule) => {
    const updateSchedule = listSchedule?.filter((s) => s.idTrip !== schedule);
    setListSchedule(updateSchedule);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "45%",
        },
      }}
    >
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
              value={tripData?.staff?.fullName}
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
              value={tripData?.driver?.fullName}
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
              value={tripData?.vehicle?.name}
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
              value={tripData?.vehicle?.type}
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
              value={tripData?.vehicle?.capacity}
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
                .unix(tripData?.departureDateLT)
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
                .unix(tripData?.endDateLT)
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
              value={tripData?.route?.departurePoint}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Điểm Kết Thúc"
              value={tripData?.route?.destination}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography variant="h5" sx={{ color: "grey" }}>
              Những ngày lặp lại chuyến:{" "}
            </Typography>
            {listSchedule?.map((dataListSchedule, index) => (
              <List
                key={dataListSchedule.idTrip}
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  display: "flex",
                  alignItems: "center",
                  mt: "20px",
                }}
              >
                <ListItem
                  secondaryAction={
                    <IconButton
                      aria-label="cancel"
                      onClick={() => handleDelete(dataListSchedule.idTrip)}
                    >
                      <HighlightOffIcon
                        sx={{
                          color: "red",
                        }}
                      />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`Ngày lặp: ${moment(
                      dataListSchedule?.departureDateLT * 1000
                    )
                      .subtract(7, "hours")
                      .format("DD/MM/YYYY")}`}
                  />
                </ListItem>
              </List>
            ))}
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography variant="h5" sx={{ color: "grey" }}>
              Danh sách loại vé:{" "}
            </Typography>
            {tripData?.route?.listTicketType
              ?.filter((t) => t.priceInTrip !== -1)
              .map((ticketInTrip, index) => (
                <List
                  key={ticketInTrip.idTicketType}
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    display: "flex",
                    alignItems: "center",
                    mt: "20px",
                  }}
                >
                  <ListItem>
                    <ListItemText
                      primary={`${index + 1}. ${
                        ticketInTrip?.name
                      } - ${formatMoney(ticketInTrip?.defaultPrice)}`}
                    />
                  </ListItem>
                </List>
              ))}
          </Grid>

          <Grid item xs={12} md={12}>
            <Typography variant="h5" sx={{ color: "grey", mb: "10px" }}>
              Danh sách trạm dừng chân:{" "}
            </Typography>
            {tripData?.route?.listStationInRoute?.map((dataTrip, index) => (
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
                      {dataTrip?.station?.name}
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary" }}
                      textAlign="center"
                    >
                      {dataTrip?.distance} Km
                    </Typography>
                  </AccordionSummary>
                  <Divider />
                  <AccordionDetails sx={{ bgcolor: "whitesmoke" }}>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Địa chỉ: </span>
                      {dataTrip?.station?.address}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Tỉnh/Thành: </span>
                      {dataTrip?.station?.province}
                    </Typography>
                    {/* <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>Giá Trạm: </span>
                      {formatMoney(dataTrip?.costsIncurred)}
                    </Typography> */}
                    <Typography sx={{ mb: 2 }}>
                      <span style={{ fontWeight: 600 }}>
                        Thời Gian Đến ( Dự Kiến):{" "}
                      </span>
                      {dataTrip?.timeCome}
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
