import React, { useEffect, useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import bookingApi from "../../utils/bookingAPI";

const SeatingChart = ({ data, floor, listTickets }) => {
  const [listSeatSelected, setListSeatSelected] = useState([]);
  const [listSeatSelectedAPI, setListSeatSelectedAPI] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const listSeat =
    floor === 1
      ? [
          "A1",
          "A2",
          "A3",
          "A4",
          "A5",
          "A6",
          "A7",
          "A8",
          "A9",
          "A10",
          "A11",
          "A12",
          "A13",
          "A14",
          "A15",
          "A16",
          "A17",
          "A18",
          "A19",
          "A20",
          "A21",
          "A22",
          "A23",
          "A24",
          "A25",
          "A26",
          "A27",
          "A28",
          "A29",
          "A30",
        ]
      : [
          "A1",
          "A2",
          "A3",
          "A4",
          "A5",
          "A6",
          "A7",
          "A8",
          "A9",
          "A10",
          "A11",
          "A12",
          "A13",
          "A14",
          "A15",
          "A16",
          "A17",
          "A18",
          "A19",
          "A20",
          "A21",
          "A22",
        ];
  console.log("location: ", location.state, data);

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
          idTicket: parseInt(id),
          seatName: listSeatSelected[0],
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
    setListSeatSelected([seatName]);
  };

  if (floor === 1) {
    return (
      <Box>
        <Box>
          <Grid container spacing={4}>
            <Grid container item justifyContent="center" spacing={6}>
              {listSeat.map((seat, seatIndex) => (
                <Grid item key={seatIndex} xs={4}>
                  {location.state?.findIndex((t) => t === seat) === -1 && (
                    <Button
                      variant="contained"
                      color={
                        listSeatSelected[0] === seat ? "warning" : "primary"
                      }
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat}
                    </Button>
                  )}

                  {location.state?.findIndex((t) => t === seat) !== -1 && (
                    <Button
                      variant="contained"
                      color={data === seat ? "success" : "info"}
                      disabled={data === seat ? false : true}
                    >
                      {seat}
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
            alignItems: "center",
            p: "100px",
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
              {listSeat
                .slice(0, Math.round(listSeat?.length / 2))
                .map((seat, seatIndex) => (
                  <Grid item key={seatIndex} xs={6}>
                    {location.state?.findIndex((t) => t === seat) === -1 && (
                      <Button
                        variant="contained"
                        color={
                          listSeatSelected[0] === seat ? "warning" : "primary"
                        }
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </Button>
                    )}
                    {location.state?.findIndex((t) => t === seat) !== -1 && (
                      <Button
                        variant="contained"
                        color={data === seat ? "success" : "info"}
                        disabled={data === seat ? false : true}
                      >
                        {seat}
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
              {listSeat
                .slice(Math.round(listSeat?.length / 2), listSeat?.length)
                .map((seat, seatIndex) => (
                  <Grid item key={seatIndex} xs={6}>
                    {location.state?.findIndex((t) => t === seat) === -1 && (
                      <Button
                        variant="contained"
                        color={
                          listSeatSelected[0] === seat ? "warning" : "primary"
                        }
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </Button>
                    )}
                    {location.state?.findIndex((t) => t === seat) !== -1 && (
                      <Button
                        variant="contained"
                        color={data === seat ? "success" : "info"}
                        disabled={data === seat ? false : true}
                      >
                        {seat}
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
