import CreateTripByStaff from "../component/createTripByStaff/createtripByStaff";
import SeatingChart from "../component/seatingChart/seatingChart";
import UserProfile from "../pages/_profile/profile_page";
import BusManagement from "../pages/admin/bus_management";
import ListSystemServicePage from "../pages/admin/config_service_system";
import NewsManagement from "../pages/admin/news_management";
import StationManagement from "../pages/admin/station_management";
import TripDetailPage from "../pages/admin/trip_detail";
import TripManagement from "../pages/admin/trip_management";
import TripRequestList from "../pages/admin/trip_request_management";
import UserManagement from "../pages/admin/user_management";
import HistoryTripByIdDriver from "../pages/admin/viewHistoryTripByIdDriver";
import Dashboard from "../pages/dashboard/dashboard";
import ChangeTicketPage from "../pages/staff/change_ticket";
import RouteManagement from "../pages/admin/route_management"

export const publicRoutes = [
  {
    path: "/dash-board",
    element: <Dashboard />,
  },
  {
    path: "/history-trip-by-id/:id",
    element: <HistoryTripByIdDriver />,
  },
  {
    path: "/trip-detail/:id",
    element: <TripDetailPage />,
  },
  {
    path: "/user-managements",
    element: <UserManagement />,
  },
  {
    path: "/user-profile",
    element: <UserProfile />,
  },
  {
    path: "/trip-managements",
    element: <TripManagement />,
  },
  {
    path: "/Bus-managements",
    element: <BusManagement />,
  },
  {
    path: "/Station-managements",
    element: <StationManagement />,
  },
  {
    path: "/Route-managements",
    element: <RouteManagement />,
  },
  {
    path: "/news-managements",
    element: <NewsManagement />,
  },
];
export const adminRoutes = [
  {
    path: "/trip-request-managements",
    element: <TripRequestList />,
  },
  {
    path: "/config-service",
    element: <ListSystemServicePage />,
  },
];

export const staffRoutes = [
  {
    path: "/change-tiket",
    element: <ChangeTicketPage />,
  },
  {
    path: "/create-trip",
    element: <CreateTripByStaff />,
  },
  {
    path: "/seating-chart",
    element: <SeatingChart />,
  },
];