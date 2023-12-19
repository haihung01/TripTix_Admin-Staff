import React, { useEffect, useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import bookingApi from "../../utils/bookingAPI";

const SeatingChart = ({ data, floor, listTickets }) => {
  const [listSeatSelected, setListSeatSelected] = useState([]);
  const [listSeatSelectedAPI, setListSeatSelectedAPI] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const listTicketSelected = listTickets?.map((t) => t?.seatName);
    setListSeatSelected(listTicketSelected || []);
    setListSeatSelectedAPI(listTicketSelected || []);
  }, [listTickets]);

  const handleSubmitChage = async () => {
    const confirm = window.confirm(
      "Bạn có chắc muốn thay đổi chỗ ngồi hiện tại ?"
    );
    if (confirm) {
      try {
        const dataUpdate = {
          idBooking: parseInt(id),
          seatName: listSeatSelected,
        };
        await bookingApi.changeTicketForCustomer(dataUpdate);
        toast.success("Đổi chỗ ngồi thành công !");
        navigate("/change-ticket");
      } catch (error) {
        console.log("errr", error.response.data.message);
        toast.error(error.response.data.message);
      }
    }
  };
  const maxTickets = listTickets?.length || 0;
  const handleSeatClick = (seatName) => {
    const check = listSeatSelected.find((t) => t === seatName);

    if (listSeatSelected?.length === maxTickets && check === undefined) {
      toast.error("Không được chọn quá số chỗ khách đã đặt trước đó !");
      console.log("list selected: ", listSeatSelected);
      return;
    }
    if (check) {
      const newList = listSeatSelected.filter((t) => t !== seatName);
      setListSeatSelected(newList || []);
      console.log("list selected: ", listSeatSelected);

      return;
    } else {
      const newList = [...listSeatSelected, seatName];
      setListSeatSelected(newList);
      console.log("list selected: ", listSeatSelected, newList);

      return;
    }
  };

  if (floor === 1) {
    return (
      <Box>
        <Box>
          <Grid container spacing={4}>
            <Grid container item justifyContent="center" spacing={6}>
              {data.map((seat, seatIndex) => (
                <Grid item key={seatIndex} xs={6}>
                  {seat.status === "AVAILABLE" && (
                    <Button
                      variant="contained"
                      color={
                        listSeatSelected?.find((t) => t === seat.seatName)
                          ? "success"
                          : "primary"
                      }
                      onClick={() => handleSeatClick()}
                    >
                      {seat.seatName}
                    </Button>
                  )}
                  {seat.status === "UNAVAILABLE" && (
                    <Button
                      variant="contained"
                      color={
                        listSeatSelected?.find((t) => t === seat.seatName) &&
                        "success"
                      }
                      onClick={() => handleSeatClick(seat.seatName)}
                      disabled={
                        listSeatSelected?.find((t) => t === seat.seatName) ||
                        listSeatSelectedAPI?.find((t) => t === seat.seatName)
                          ? false
                          : true
                      }
                    >
                      {seat.seatName}
                    </Button>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            m: "20px",
          }}
        >
          <Button onClick={handleSubmitChage}>Xác nhận</Button>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box>
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid
              container
              item
              justifyContent="center"
              spacing={6}
              xs={6}
              md={6}
            >
              {data
                .slice(0, Math.round(data?.length / 2))
                .map((seat, seatIndex) => (
                  <Grid item key={seatIndex} xs={6}>
                    {seat.status === "AVAILABLE" && (
                      <Button
                        variant="contained"
                        color={
                          listSeatSelected?.find((t) => t === seat.seatName)
                            ? "success"
                            : "primary"
                        }
                        onClick={() => handleSeatClick(seat.seatName)}
                      >
                        {seat.seatName}
                      </Button>
                    )}
                    {seat.status === "UNAVAILABLE" && (
                      <Button
                        variant="contained"
                        color={
                          listSeatSelected?.find((t) => t === seat.seatName) &&
                          "success"
                        }
                        onClick={() => handleSeatClick(seat.seatName)}
                        disabled={
                          listSeatSelected?.find((t) => t === seat.seatName) ||
                          listSeatSelectedAPI?.find((t) => t === seat.seatName)
                            ? false
                            : true
                        }
                      >
                        {seat.seatName}
                      </Button>
                    )}
                  </Grid>
                ))}
            </Grid>
            <Grid
              container
              item
              justifyContent="center"
              spacing={6}
              xs={6}
              md={6}
            >
              {data
                .slice(Math.round(data?.length / 2), data?.length)
                .map((seat, seatIndex) => (
                  <Grid item key={seatIndex} xs={6}>
                    {seat.status === "AVAILABLE" && (
                      <Button
                        variant="contained"
                        color={
                          listSeatSelected?.find((t) => t === seat.seatName)
                            ? "success"
                            : "primary"
                        }
                        onClick={() => handleSeatClick(seat.seatName)}
                      >
                        {seat.seatName}
                      </Button>
                    )}
                    {seat.status === "UNAVAILABLE" && (
                      <Button
                        variant="contained"
                        color={
                          listSeatSelected?.find((t) => t === seat.seatName) &&
                          "success"
                        }
                        onClick={() => handleSeatClick(seat.seatName)}
                        disabled={
                          listSeatSelected?.find((t) => t === seat.seatName) ||
                          listSeatSelectedAPI?.find((t) => t === seat.seatName)
                            ? false
                            : true
                        }
                      >
                        {seat.seatName}
                      </Button>
                    )}
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            m: "100px",
          }}
        >
          <Button
            sx={{
              backgroundColor: "#6D6DFF",
              color: "white",
              width: "160px",
              ":hover": { bgcolor: "#6868AE" },
            }}
            onClick={handleSubmitChage}
          >
            Xác nhận
          </Button>
        </Box>
      </Box>
    );
  }
};

export default SeatingChart;
