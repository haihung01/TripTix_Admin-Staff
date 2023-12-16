import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChart.scss";
import listUserApi from "../../utils/listUsersAPI";
import { toast } from "react-toastify";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";

const PieChartBox = () => {
  const [datas, setdata] = useState([
    { role: "Staff", value: 200, color: "#0088FE" },
    { role: "Customer", value: 100, color: "#00C49F" },
    { role: "Driver", value: 300, color: "#FFBB28" },
  ]);
  useEffect(() => {
    const fetchListUser = async () => {
      try {
        const response = await listUserApi.getAll({});
        let staff = 0,
          customer = 0,
          driver = 0;
        response.data.map((d) => {
          if (d.role === "ROLE_STAFF") {
            staff = staff + 1;
          }
          if (d.role === "ROLE_DRIVER") {
            driver = driver + 1;
          }
          if (d.role === "ROLE_CUSTOMER") {
            customer = customer + 1;
          }
          return d;
        });
        setdata([
          { role: "Staff", value: staff, color: "#0088FE" },
          { role: "Customer", value: customer, color: "#00C49F" },
          { role: "Driver", value: driver, color: "#FFBB28" },
        ]);
      } catch (error) {
        console.log("err", error);
        setdata([
          { role: "Staff", value: 200, color: "#0088FE" },
          { role: "Customer", value: 100, color: "#00C49F" },
          { role: "Driver", value: 300, color: "#FFBB28" },
        ]);
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Load Data failed !");
        }
      }
    };
    fetchListUser();
  }, []);
  return (
    <div className="pieChartBox">
      <div className="chart">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <DonutLargeIcon sx={{ color: "#00A9FF", fontSize: "40px" }} />
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            Biểu Đồ Kiểm Soát Người Dùng
          </span>
        </div>

        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
              formatter={(value, name, props) => {
                return [value, props.payload.role];
              }}
            />
            <Pie
              data={datas}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {datas.map((item, index) => (
                <Cell key={`cell-${index}`} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="options">
          {datas.map((item) => (
            <div className="option" key={item.role}>
              <div className="title">
                <div className="dot" style={{ backgroundColor: item.color }} />
                <span style={{ fontSize: "17px" }}>
                  <span style={{ fontWeight: "bold" }}>{item.role}(s): </span>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartBox;
