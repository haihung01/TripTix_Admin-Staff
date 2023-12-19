import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import TripCreatedByStaff from "../../component/table/table_trip-staff/tableTripCreateManagements";
import TripFinishList from "../../component/table/table_trip/tableTripFinish";
import TripReadyList from "../../component/table/table_trip/tableTripReady";
import TripRunList from "../../component/table/table_trip/tableTripRun";
import TripTBL from "../../component/table/table_trip/trip_Table";
import TripRequest from "../../component/table/table_trip/trip_request";
import useAuth from "../../hook/useAuth";
import TripRequestPendingByStaff from "../../component/table/table_trip/trip_request_by_staff";

export default function Triplist() {
  const { auth } = useAuth();
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
        {auth?.user?.role === "ROLE_ADMIN" && (
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab
                  sx={{ fontWeight: "bold" }}
                  label="Chuyến Đi ( Chuẩn bị )"
                  value="1"
                />
                <Tab
                  sx={{ fontWeight: "bold" }}
                  label="Chuyến Đi ( Đang chạy )"
                  value="2"
                />
                <Tab
                  sx={{ fontWeight: "bold" }}
                  label="Chuyến Đi ( Kết thúc )"
                  value="3"
                />
                <Tab
                  sx={{ fontWeight: "bold" }}
                  label="Chuyến Đi ( Hủy bỏ)"
                  value="4"
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TripReadyList />
            </TabPanel>
            <TabPanel value="2">
              <TripRunList />
            </TabPanel>
            <TabPanel value="3">
              <TripFinishList />
            </TabPanel>
            <TabPanel value="4">
              <TripTBL />
            </TabPanel>
          </TabContext>
        )}
        {auth?.user?.role === "ROLE_STAFF" && (
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab
                  sx={{ fontWeight: "bold" }}
                  label="Chuyến Xe Của Tôi Tạo"
                  value="1"
                />
                <Tab
                  sx={{ fontWeight: "bold" }}
                  label="Chuyến Xe Tôi Chờ Duyệt"
                  value="2"
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TripCreatedByStaff />
            </TabPanel>
            <TabPanel value="2">
              {/* <TripRequest /> */}
              <TripRequestPendingByStaff />
            </TabPanel>
          </TabContext>
        )}
      </Box>
    </ThemeProvider>
  );
}
