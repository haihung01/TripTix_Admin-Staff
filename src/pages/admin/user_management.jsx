import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ThemeProvider, createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import React from "react";
import CustomerTBL from "../../component/table/table_user/customer_table";
import DriverTBL from "../../component/table/table_user/driver_table";
import StaffTBL from "../../component/table/table_user/staff_table";
import useAuth from "../../hook/useAuth";

export default function UserManagement() {
  const [value, setValue] = React.useState("1");
  const { auth } = useAuth();

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
                <Tab sx={{ fontWeight: "bold" }} label="Khách Hàng" value="1" />
                <Tab sx={{ fontWeight: "bold" }} label="Nhân Viên" value="2" />
                <Tab sx={{ fontWeight: "bold" }} label="Tài Xế" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <CustomerTBL />
            </TabPanel>
            <TabPanel value="2">
              <StaffTBL />
            </TabPanel>
            <TabPanel value="3">
              <DriverTBL />
            </TabPanel>
          </TabContext>
        )}
        {auth?.user?.role === "ROLE_STAFF" && (
          <main>
            <DriverTBL />
          </main>
        )}
      </Box>
    </ThemeProvider>
  );
}
