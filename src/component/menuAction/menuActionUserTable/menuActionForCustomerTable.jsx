import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hook/useAuth";

export default function MenuActionCustomerTable({ userData, onOpenDetail }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDetail = () => {
    onOpenDetail(userData);
    setAnchorEl(null);
  };
  const handleViewHistoryBookingOfCustomer = () => {
    navigate(`/history-trip-by-id/${userData.idUserSystem}`);
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
            color: "#ec407a",
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
      </Menu>
    </div>
  );
}
