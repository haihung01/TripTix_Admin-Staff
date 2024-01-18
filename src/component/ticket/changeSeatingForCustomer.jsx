import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import bookingApi from "../../utils/bookingAPI";
import { toast } from "react-toastify";
import { Divider, Paper, Typography } from "@mui/material";
import SeatingChart from "../seatingChart/seatingChart";
import listTripApi from "../../utils/listTripAPI";

export default function ChangeSeatingForCustomer() {
  const [dataBooking, setDataBooking] = useState([]);
  const [listSeat, setListSeat] = useState([]);
  const [floor, setFloor] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await bookingApi.getDataBookingDetail({
          id: id,
        });
        if (response.data?.idTrip) {
          const responseSeat = await listTripApi.tripDetail({
            id: response.data?.idTrip,
          });
          setListSeat(response.data?.seatName|| []);
          setFloor(response.data?.trip?.vehicleDTO?.floor);
          console.log("seat: ", responseSeat.data?.seatNameBooking);
          console.log("floor: ", response.data?.trip?.vehicleDTO?.floor);
        }
        console.log("databoking: ", response.data);
        setDataBooking(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Vé không tồn tại.");
      }
    };

    fetchBookingData();
  }, [id]);
  return (
    <Paper>
      <Typography
        textAlign="center"
        fontSize={30}
        fontWeight={600}
        sx={{ p: 2 }}
      >
        Đổi Vé Chuyến Đi Cho Khách Hàng
      </Typography>
      <Divider />

      <div
        style={{
          width: "40vw",
          paddingLeft: "29rem",
          paddingTop: "5rem",
        }}
      >
        <SeatingChart
          data={listSeat}
          floor={floor}
          listTickets={dataBooking?.listTicket}
        />
      </div>
    </Paper>
  );
}
