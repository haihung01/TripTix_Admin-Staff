import { Divider, Grid, Typography } from "@mui/material";
import TopDeal from "../../component/TopBox/TopBox";
import UserInSystem from "../../component/UserInSystem/UserInSystem";
import Chart from "../../component/chart/chart";
import DashboardStaff from "../../component/dashboardStaff/dashboardStaff";
import PieChartBox from "../../component/pieChart/pieChart";
// import Table from "../../component/table/table";
import Featured from "../../component/featured/featured";
import useAuth from "../../hook/useAuth";
import "./dashboard.scss";
import ChartQuarter from "../../component/chartQuarter/chartQuarter";

const Dashboard = () => {
  const { auth } = useAuth();
  return (
    <div className="dashboard">
      {auth?.user?.role === "ROLE_ADMIN" && (
        <div className="dashboardContainer">
          <div className="box" style={{ padding: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <UserInSystem />
              </Grid>
              <Grid item xs={12} md={6}>
                <PieChartBox />
              </Grid>
            </Grid>
          </div>
          {/* bản cũ là 2.24/1 */}
          <div className="charts">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Featured />
              </Grid>
              <Grid item xs={12} md={8}>
                <Chart title="Biểu Đồ Theo Tháng" aspect={3.16 / 1} />
              </Grid>
              <Grid item xs={12} md={12}>
                <ChartQuarter title="Biểu Đồ Theo Quý" aspect={3 / 1} />
              </Grid>
            </Grid>
          </div>
        </div>
      )}
      {auth?.user?.role === "ROLE_STAFF" && (
        <div className="dashboard__staff">
          <div className="box box1">
            <Typography
              sx={{ pt: "10px", pb: "10px", color: "grey" }}
              fontSize="20px"
              fontWeight="bold"
            >
              Bảng Xếp Hạng Chi Tiêu
            </Typography>
            <Divider />
            <div style={{ paddingTop: "20px" }}>
              <TopDeal />
            </div>
          </div>
          <div className="box box2">
            <DashboardStaff />
          </div>
          {/* <div className="box box3">Box 3</div> */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
