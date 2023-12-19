import { TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import bookingApi from "../../utils/bookingAPI";
import "./chart.scss";

const Chart = ({ aspect, title }) => {
  const [dataRevenue, setDataRevenue] = useState([]);

  //pick year
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleYearChange = (date) => {
    setSelectedYear(date.getFullYear());
  };
  const selectedYearAsInteger = parseInt(selectedYear, 10);
  console.log("format year", selectedYearAsInteger);

  //call api
  const fetchDataRevenue = useCallback(async () => {
    try {
      const response = await bookingApi.getDataMonthRevenue({
        year: selectedYearAsInteger,
      });
      console.log("Dữ liệu doanh thu: ", response.data);
      setDataRevenue(response.data);
    } catch (error) {
      console.log("err", error);
      setDataRevenue([]);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Load Data failed !");
      }
    }
  }, [selectedYearAsInteger]);

  useEffect(() => {
    fetchDataRevenue();
  }, [fetchDataRevenue]);

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <DatePicker
        selected={new Date(selectedYear, 0)}
        onChange={handleYearChange}
        showYearPicker
        dateFormat="yyyy"
        yearItemNumber={8}
        customInput={<TextField size="small" />}
      />

      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={350}
          data={dataRevenue}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6D6DFF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6D6DFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ticket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalPrice"
            stroke="#6D6DFF"
            fillOpacity={1}
            fill="url(#total)"
          >
            <Label value="Giá" position="inside" />
          </Area>
          <Area
            type="monotone"
            dataKey="totalTicket"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#ticket)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
