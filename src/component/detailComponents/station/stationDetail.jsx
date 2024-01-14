import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import listStationApi from "../../../utils/listStationAPI";
import Map from "../../mapRenderLocation/renderLocationOnMap";
import "./stationDetail.scss";

export default function StationDetail() {
  //Call API
  const { id } = useParams();
  const [isFetchData, setIsFetchData] = useState(true);
  const [stationData, setStationData] = useState([]);
  const [stationLocation, setStationLocation] = useState([10.8991, 106.8769]);

  const fetchTripData = useCallback(async () => {
    try {
      const params = { id: parseInt(id) };
      const response = await listStationApi.stationDetail(params);
      const location = response?.data?.location?.split(",")?.map(Number);
      setStationLocation(location || [10.8991, 106.8769]);
      console.log("list booking: ", response?.data?.listBooking);
      setStationData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("fetching trip data fail !");
    }
  }, [id]);

  useEffect(() => {
    if (isFetchData) {
      fetchTripData();
      setIsFetchData(false);
    }
  }, [fetchTripData, isFetchData]);

  return (
    <div className="station_detail_container">
      <div className="box box1">
        <Typography
          textAlign="center"
          sx={{
            m: 1,
            mb: 4,
            fontSize: "20px",
            fontWeight: "bold",
            color: "#696969",
          }}
        >
          ༺ Thông Tin Trạm Xe ༻
        </Typography>
        <Divider />
        <Box sx={{ p: 2, pt: 5 }}>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Tên trạm:{" "}
                </span>
                {stationData?.name}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Tỉnh/Thành Phố:{" "}
                </span>
                {stationData?.province}
              </Typography>
            </Grid>

            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Địa chỉ:{" "}
                </span>
                {stationData?.address}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography sx={{ color: "#696969", fontSize: 18 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
                >
                  Trạng Thái:{" "}
                </span>
                <span
                  className="tripStatus"
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    color:
                      stationData?.status === "ACTIVE"
                        ? "green"
                        : stationData?.status === "DEACTIVE"
                        ? "red"
                        : "black",
                    backgroundColor:
                      stationData?.status === "ACTIVE"
                        ? "rgba(0, 128, 0, 0.151)"
                        : stationData?.status === "DEACTIVE"
                        ? "rgb(253, 183, 183)"
                        : "white",
                  }}
                >
                  {stationData?.status === "DEACTIVE"
                    ? "NGƯNG HOẠT ĐỘNG"
                    : stationData?.status === "ACTIVE"
                    ? "ĐANG HOẠT ĐỘNG"
                    : stationData?.status}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="box box2">
        <Map position={stationLocation} name={stationData?.busDTO?.name} />
      </div>
    </div>
  );
}
