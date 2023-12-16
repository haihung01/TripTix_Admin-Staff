import React from "react";
import { Grid, Button } from "@mui/material";

const SeatingChart = () => {
  // Giả sử rằng chúng ta có 10 hàng, mỗi hàng có 4 ghế
  const rows = 6;
  const seatsPerRow = 2;

  // Tạo một mảng 2D để biểu diễn sơ đồ ghế
  const seats = Array(rows)
    .fill()
    .map(() => Array(seatsPerRow).fill(false));

  const handleSeatClick = (row, seat) => {
    // Cập nhật trạng thái của ghế khi nó được nhấn
    seats[row][seat] = !seats[row][seat];
  };

  return (
    <Grid container spacing={4}>
      {seats.map((row, rowIndex) => (
        <Grid container item key={rowIndex} justifyContent="center" spacing={6}>
          {row.map((seat, seatIndex) => (
            <Grid item key={seatIndex}>
              <Button
                variant="contained"
                color={seat ? "secondary" : "primary"}
                onClick={() => handleSeatClick(rowIndex, seatIndex)}
              >
                {rowIndex}-{seatIndex}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default SeatingChart;
