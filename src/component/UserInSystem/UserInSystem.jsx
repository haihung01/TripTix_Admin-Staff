import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import listUserApi from "../../utils/listUsersAPI";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

function UserInSystem() {
  const [members, setMember] = useState("10");
  useEffect(() => {
    const fetchListUser = async () => {
      try {
        const response = await listUserApi.getAll({});
        console.log("dataTBL", response);
        setMember(response.data);
      } catch (error) {
        console.log("err", error);
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
    members && (
      <div
        style={{
          WebkitBoxShadow: "2px 4px 10px 1px rgba(0, 0, 0, 0.47)",
          boxShadow: "2px 4px 10px 1px rgba(201, 201, 201, 0.47)",
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <SupervisedUserCircleIcon
            sx={{ color: "#A8DF8E", fontSize: "40px" }}
          />
          <span style={{ color: "gray", fontSize: "20px", fontWeight: "bold" }}>
            Tổng Người Dùng
          </span>
        </div>
        <div
          style={{ padding: "97px", display: "flex", flexDirection: "column" }}
        >
          <span
            style={{
              border: "50%",
              borderRadius: "2px solid grey",
              fontSize: "50px",
              fontWeight: "bold",
              color: "grey",
              textAlign: "center",
              padding: "5px",
            }}
          >
            {members.length}
          </span>
          <span
            style={{ textAlign: "center", fontWeight: "bold", color: "grey" }}
          >
            Người Dùng Trong Hệ Thống
          </span>
        </div>
      </div>
    )
  );
}

export default UserInSystem;
