import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../../hook/useAuth";
import listUserApi from "../../utils/listUsersAPI";
import ChangePasswordModal from "../table/model_popup/profile_model/changePasswordModel";
import ChangeProfileModal from "../table/model_popup/profile_model/updateProfileModel";

const UserProfile = () => {
  const { auth } = useAuth();
  const [userData, setUserData] = useState({
    citizenIdentityCard: "NULL",
    assignedRegions: "NULL",
    fullName: "",
    phone: "",
    address: "",
    email: "",
    birthdayLong: "",
    gender: "",
  });

  //CHANGE PASSWORD
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  //CHANGE PROFILE
  const [openChangeProfile, setOpenChangeProfile] = useState(false);

  const handleOpenChangeProfile = () => {
    setOpenChangeProfile(true);
  };

  const handleCloseChangeProfile = () => {
    setOpenChangeProfile(false);
  };

  const handleUpdateProfileSuccess = () => {
    fetchUserData();
  };

  const fetchUserData = useCallback(async () => {
    try {
      const params = { id: auth.user.idUserSystem };
      const response = await listUserApi.getUserById(params);
      const user = response.data;
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [auth.user.idUserSystem, setUserData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const [avatarImage] = useState(
    "https://icon-library.com/images/admin-icon-png/admin-icon-png-16.jpg"
  );

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          pt: "60px",
        }}
      >
        <Paper
          sx={{
            height: "450px",
            width: "350px",
            borderRadius: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div>
            <Avatar
              alt="User Avatar"
              src={avatarImage || "/path/to/default-avatar.jpg"}
              sx={{ width: "200px", height: "200px", ml: "auto", mr: "auto" }}
            />
            <Typography
              textAlign="center"
              sx={{ pt: "10px", fontSize: "30px" }}
            >
              {userData.fullName}
            </Typography>
            <Typography
              textAlign="center"
              sx={{ pt: "5px", fontSize: "20px", color: "grey" }}
            >
              <span style={{ fontWeight: 600, color: "black" }}>
                CMND/CCCD:
              </span>{" "}
              {userData.citizenIdentityCard}
            </Typography>
          </div>
        </Paper>
        <Paper sx={{ height: "450px", width: "850px", borderRadius: "30px" }}>
          <div>
            <Grid container spacing={4} sx={{ p: "40px" }}>
              <Grid item xs={12} md={12}>
                <Typography sx={{ fontSize: "25px", color: "grey" }}>
                  Thông Tin Người Dùng
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Họ Tên"
                  fullWidth
                  variant="outlined"
                  value={userData.fullName}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  variant="outlined"
                  value={userData.email}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Địa Chỉ"
                  fullWidth
                  variant="outlined"
                  value={userData.address}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số Điện Thoại"
                  fullWidth
                  variant="outlined"
                  value={userData.phone}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ngày Sinh"
                  fullWidth
                  variant="outlined"
                  value={moment(userData?.birthdayLong * 1000).format(
                    "DD/MM/YYYY"
                  )}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Giới Tính"
                  fullWidth
                  variant="outlined"
                  value={
                    userData?.gender === "FEMALE"
                      ? "Nữ"
                      : userData?.gender === "MALE"
                      ? "Nam"
                      : ""
                  }
                  inputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </div>
          <Divider />
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              paddingTop: "15px",
            }}
          >
            <Button
              onClick={handleOpenChangeProfile}
              variant="contained"
              sx={{
                backgroundColor: "#6D6DFF",
                color: "white",
                width: "180px",
                ":hover": { bgcolor: "#6868AE" },
              }}
            >
              Cập Nhật Hồ Sơ
            </Button>

            <Button
              onClick={handleOpenChangePassword}
              variant="contained"
              sx={{
                backgroundColor: "#6D6DFF",
                color: "white",
                width: "180px",
                ":hover": { bgcolor: "#6868AE" },
              }}
            >
              Thay Đổi Mật Khẩu
            </Button>
          </div>

          {/* Model change password */}
          <ChangePasswordModal
            open={openChangePassword}
            handleClose={handleCloseChangePassword}
            id={auth.user.idUserSystem}
          />

          {/* Model change profile */}
          <ChangeProfileModal
            open={openChangeProfile}
            handleClose={handleCloseChangeProfile}
            userData={userData}
            fetchUserProfile={handleUpdateProfileSuccess}
          />
        </Paper>
      </Box>
    </div>
  );
};

export default UserProfile;
