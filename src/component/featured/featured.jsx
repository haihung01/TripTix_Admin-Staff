// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import { useCallback, useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "react-toastify";
import bookingApi from "../../utils/bookingAPI";
import "./featured.scss";
import useMoneyFormatter from "../../hook/useMoneyFormatter";

const Featured = () => {
  //call api
  const [dataRevenue, setDataRevenue] = useState([]);
  const fetchDataRevenue = useCallback(async () => {
    try {
      const response = await bookingApi.getDailyRevenue({});
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
  }, []);

  useEffect(() => {
    fetchDataRevenue();
  }, [fetchDataRevenue]);

  //format money
  const [formatMoney] = useMoneyFormatter();

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title" style={{ textDecoration: "underline" }}>
          Lợi Nhuận Ngày
        </h1>
      </div>
      <div className="bottom">
        <p className="title">Tổng Lợi Nhuận Trong Ngày Hôm Nay</p>
        <p className="amount">
          {formatMoney(dataRevenue.totalAmountPriceToday)}
        </p>
        <p className="desc">
          Xử lý giao dịch trước đó. Các khoản thanh toán cuối cùng có thể không
          được bao gồm.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Số Vé Bán Ra</div>
            <div
              className="itemResult positive"
              style={{
                display: "flex",
                alignItems: "flex-end",
                alignContent: "center",
                justifyContent: "space-evenly",
              }}
            >
              <ConfirmationNumberOutlinedIcon fontSize="small" />
              <div className="resultAmount" style={{ textAlign: "center" }}>
                {dataRevenue.numberOfTicketToday}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Ngày Hôm Qua</div>
            <div
              className="itemResult positive"
              style={{
                display: "flex",
                alignItems: "flex-end",
                alignContent: "center",
                justifyContent: "space-evenly",
              }}
            >
              <ShowChartOutlinedIcon fontSize="small" />
              <div className="resultAmount">
                {formatMoney(dataRevenue.totalAmountPriceYesterday)}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">So sánh 2 ngày</div>
            <div className="itemResult positive">
              {/* <KeyboardArrowUpOutlinedIcon fontSize="small" /> */}
              <div className="resultAmount">{dataRevenue.comparisonResult}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
