import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";

export default function MenuActionStaffTable({
  userData,
  onOpenUpdate,
  onOpenDetail,
  onOpenBan,
  onOpenUnban,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleUpdate = () => {
    onOpenUpdate(userData);
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
        <MenuItem onClick={() => handleUpdate()}>
          <EditIcon sx={{ mr: "4px", color: "#9ADE7B" }} />
          <span>Cập nhật</span>
        </MenuItem>
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

        {/* <MenuItem onClick={() => handleStartFeedBack(id)}>
          <FeedbackOutlinedIcon sx={{ mr: "4px" }} color="success" />
          <span>Mở phản hồi</span>
        </MenuItem> */}
      </Menu>
    </div>
  );
}
