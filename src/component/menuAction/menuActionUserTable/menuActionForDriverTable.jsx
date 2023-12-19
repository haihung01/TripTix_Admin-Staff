import BlockIcon from "@mui/icons-material/Block";
import InfoIcon from "@mui/icons-material/Info";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hook/useAuth";

export default function MenuActionDriverTable({
  userData,
  onOpenDetail,
  onOpenBan,
  onOpenUnban,
}) {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleViewHistoryTrip = () => {
    navigate(`/history-trip-by-id/${userData.idUserSystem}`);
    setAnchorEl(null);
  };
  const handleDetail = () => {
    onOpenDetail(userData);
    setAnchorEl(null);
  };
  const handleBan = () => {
    onOpenBan(userData);
    setAnchorEl(null);
  };
  const handleUnban = () => {
    onOpenUnban(userData);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ width: "20px" }}
      >
        <MoreHorizIcon
          sx={{
            color: "#6464CD",
          }}
        />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => handleDetail()}>
          <InfoIcon sx={{ mr: "4px" }} color="info" />
          <span>Chi Tiết</span>
        </MenuItem>
        {auth?.user?.role === "ROLE_ADMIN" && (
          <MenuItem onClick={() => handleViewHistoryTrip()}>
            <WorkHistoryIcon sx={{ mr: "4px", color: "#9ADE7B" }} />
            <span>Lịch Sử Chuyến Đi</span>
          </MenuItem>
        )}
        {auth?.user?.role === "ROLE_ADMIN" && (
          <Box>
            {userData && userData.status === "ACTIVE" && (
              <MenuItem onClick={() => handleBan()}>
                <BlockIcon sx={{ mr: "4px" }} color="error" />
                <span>Khóa Tài Khoản</span>
              </MenuItem>
            )}
            {userData && userData.status === "DEACTIVE" && (
              <MenuItem onClick={() => handleUnban()}>
                <LockOpenIcon sx={{ mr: "4px" }} color="error" />
                <span>Mở Khóa tài Khoản</span>
              </MenuItem>
            )}
          </Box>
        )}

        {/* <MenuItem onClick={() => handleStartFeedBack(id)}>
          <FeedbackOutlinedIcon sx={{ mr: "4px" }} color="success" />
          <span>Mở phản hồi</span>
        </MenuItem> */}
      </Menu>
    </div>
  );
}
