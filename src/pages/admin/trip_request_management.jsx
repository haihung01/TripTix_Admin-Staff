import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import TripRequestPending from "../../component/table/table_trip/trip_request";
import TripRequestAccept from "../../component/table/table_trip/trip_request_accept";
import TripRequestCancel from "../../component/table/table_trip/trip_request_cancel";

export default function TripRequestList() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#6464CD",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab sx={{ fontWeight: "bold" }} label="Chờ Duyệt" value="1" />
              {/* <Tab label="Chấp Nhận" value="2" /> */}
              <Tab sx={{ fontWeight: "bold" }} label="Hủy Bỏ" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TripRequestPending />
          </TabPanel>
          {/* <TabPanel value="2">
            <TripRequestAccept />
          </TabPanel> */}
          <TabPanel value="3">
            <TripRequestCancel />
          </TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
}
