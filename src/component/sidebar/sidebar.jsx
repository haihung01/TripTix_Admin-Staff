import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CommuteIcon from "@mui/icons-material/Commute";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DockIcon from "@mui/icons-material/Dock";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FeedIcon from "@mui/icons-material/Feed";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RouteIcon from "@mui/icons-material/Route";
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hook/useAuth";
import "./sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const { setAuth, auth } = useAuth();
  const location = useLocation(); // Sử dụng useLocation để lấy thông tin về URL hiện tại
  const isActive = (path) => {
    return location.pathname === path; // So sánh URL hiện tại với path của mỗi thẻ
  };
  const handleLogOut = () => {
    localStorage.clear();
    setAuth({});
    navigate("/login-page");
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography variant="h6" className="logo">
            𝓣𝓻𝓲𝓹𝓽𝓲𝔁
          </Typography>
        </Link>
      </div>
      <Divider />
      <div className="center">
        <List>
          <Typography className="title">CHÍNH</Typography>

          <Link to="/dash-board" style={{ textDecoration: "none" }}>
            <ListItemButton
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                clipPath:
                  "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                backgroundImage: isActive("/dash-board")
                  ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                  : "transparent",
                color: isActive("/dash-board") ? "white" : "#888",
                width: isActive("/dash-board") ? "245px" : "transparent",
                ":hover": { width: "245px" },
              }}
            >
              <ListItemIcon>
                <DashboardIcon
                  sx={{ color: isActive("/dash-board") ? "white" : "#4C4CAA" }}
                />
              </ListItemIcon>
              <ListItemText primary="Bảng Điều Khiển" />
            </ListItemButton>
          </Link>

          <Typography className="title">Danh Sách</Typography>

          <Link to="/user-managements" style={{ textDecoration: "none" }}>
            <ListItemButton
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                clipPath:
                  "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                backgroundImage: isActive("/user-managements")
                  ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                  : "transparent",
                color: isActive("/user-managements") ? "white" : "#888",
                width: isActive("/user-managements") ? "245px" : "transparent",
                ":hover": { width: "245px" },
              }}
            >
              <ListItemIcon>
                <PersonOutlineIcon
                  sx={{
                    color: isActive("/user-managements") ? "white" : "#4C4CAA",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Người Dùng" />
            </ListItemButton>
          </Link>

          <Link to="/news-managements" style={{ textDecoration: "none" }}>
            <ListItemButton
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                clipPath:
                  "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                backgroundImage: isActive("/news-managements")
                  ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                  : "transparent",
                color: isActive("/news-managements") ? "white" : "#888",
                width: isActive("/news-managements") ? "245px" : "transparent",
                ":hover": { width: "245px" },
              }}
            >
              <ListItemIcon>
                <FeedIcon
                  sx={{
                    color: isActive("/news-managements") ? "white" : "#4C4CAA",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Bảng Tin" />
            </ListItemButton>
          </Link>

          <Link to="/trip-managements" style={{ textDecoration: "none" }}>
            <ListItemButton
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                clipPath:
                  "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                backgroundImage: isActive("/trip-managements")
                  ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                  : "transparent",
                color: isActive("/trip-managements") ? "white" : "#888",
                width: isActive("/trip-managements") ? "245px" : "transparent",
                ":hover": { width: "245px" },
              }}
            >
              <ListItemIcon>
                <CommuteIcon
                  sx={{
                    color: isActive("/trip-managements") ? "white" : "#4C4CAA",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Chuyến Đi" />
            </ListItemButton>
          </Link>
          {auth?.user?.role === "ROLE_ADMIN" && (
            <Link
              to="/trip-request-managements"
              style={{ textDecoration: "none" }}
            >
              <ListItemButton
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  clipPath:
                    "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                  backgroundImage: isActive("/trip-request-managements")
                    ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                    : "transparent",
                  color: isActive("/trip-request-managements")
                    ? "white"
                    : "#888",
                  width: isActive("/trip-request-managements")
                    ? "245px"
                    : "transparent",
                  ":hover": { width: "245px" },
                }}
              >
                <ListItemIcon>
                  <NotListedLocationIcon
                    sx={{
                      color: isActive("/trip-request-managements")
                        ? "white"
                        : "#4C4CAA",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Duyệt Chuyến Đi" />
              </ListItemButton>
            </Link>
          )}

          <Link to="/station-managements" style={{ textDecoration: "none" }}>
            <ListItemButton
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                clipPath:
                  "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                backgroundImage: isActive("/station-managements")
                  ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                  : "transparent",
                color: isActive("/station-managements") ? "white" : "#888",
                width: isActive("/station-managements")
                  ? "245px"
                  : "transparent",
                ":hover": { width: "245px" },
              }}
            >
              <ListItemIcon>
                <DockIcon
                  sx={{
                    color: isActive("/station-managements")
                      ? "white"
                      : "#4C4CAA",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Trạm xe" />
            </ListItemButton>
          </Link>

          {/* Mangage route============================ */}
          <Link to="/Route-managements" style={{ textDecoration: "none" }}>
            <ListItemButton
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                clipPath:
                  "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                backgroundImage: isActive("/Route-managements")
                  ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                  : "transparent",
                color: isActive("/Route-managements") ? "white" : "#888",
                width: isActive("/Route-managements") ? "245px" : "transparent",
                ":hover": { width: "245px" },
              }}
            >
              <ListItemIcon>
                <RouteIcon
                  sx={{
                    color: isActive("/Route-managements") ? "white" : "#4C4CAA",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Tuyến đường" />
            </ListItemButton>
          </Link>

          <Link to="/bus-managements" style={{ textDecoration: "none" }}>
            <ListItemButton
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                clipPath:
                  "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                backgroundImage: isActive("/bus-managements")
                  ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                  : "transparent",
                color: isActive("/bus-managements") ? "white" : "#888",
                width: isActive("/bus-managements") ? "245px" : "transparent",
                ":hover": { width: "245px" },
              }}
            >
              <ListItemIcon>
                <DirectionsBusIcon
                  sx={{
                    color: isActive("/bus-managements") ? "white" : "#4C4CAA",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Xe Khách" />
            </ListItemButton>
          </Link>

          <Typography className="title">DỊCH VỤ</Typography>
          {auth?.user?.role === "ROLE_ADMIN" && (
            <Link to="/config-service" style={{ textDecoration: "none" }}>
              <ListItemButton
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  clipPath:
                    "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                  backgroundImage: isActive("/config-service")
                    ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                    : "transparent",
                  color: isActive("/config-service") ? "white" : "#888",
                  width: isActive("/config-service") ? "245px" : "transparent",
                  ":hover": { width: "245px" },
                }}
              >
                <ListItemIcon>
                  <DesignServicesIcon
                    sx={{
                      color: isActive("/config-service") ? "white" : "#4C4CAA",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Cấu Hình Dịch Vụ" />
              </ListItemButton>
            </Link>
          )}

          {auth?.user?.role === "ROLE_STAFF" && (
            <Link to="/change-ticket" style={{ textDecoration: "none" }}>
              <ListItemButton
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  clipPath:
                    "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",

                  backgroundImage: isActive("/change-ticket")
                    ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                    : "transparent",
                  color: isActive("/change-ticket") ? "white" : "#888",
                  width: isActive("/change-ticket") ? "245px" : "transparent",
                  ":hover": { width: "245px" },
                }}
              >
                <ListItemIcon>
                  <ChangeCircleIcon
                    sx={{
                      color: isActive("/change-ticket") ? "white" : "#4C4CAA",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Đổi Vé Cho Khách" />
              </ListItemButton>
            </Link>
          )}

          <Typography className="title">Người Dùng</Typography>

          <Link to="/user-profile" style={{ textDecoration: "none" }}>
            <ListItemButton
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                clipPath:
                  "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
                backgroundImage: isActive("/user-profile")
                  ? "linear-gradient(to right, #3232a2, #5551b2, #7471c1, #9291cf, #b2b2dc)"
                  : "transparent",
                color: isActive("/user-profile") ? "white" : "#888",
                width: isActive("/user-profile") ? "245px" : "transparent",
                ":hover": { width: "245px" },
              }}
            >
              <ListItemIcon>
                <AccountCircleOutlinedIcon
                  sx={{
                    color: isActive("/user-profile") ? "white" : "#4C4CAA",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Hồ Sơ Cá Nhân" />
            </ListItemButton>
          </Link>

          <ListItemButton
            onClick={handleLogOut}
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              clipPath:
                "polygon(0 0,0 0,100% 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 100%)",
              color: "#888",
              ":hover": { width: "245px" },
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "#4C4CAA" }} />
            </ListItemIcon>
            <ListItemText primary="Đăng Xuất" />
          </ListItemButton>
        </List>
      </div>
    </div>
  );
};

export default Sidebar;
