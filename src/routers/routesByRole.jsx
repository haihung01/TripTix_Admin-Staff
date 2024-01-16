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
import RouteManagement from "../pages/admin/route_management";
import TableHistoryBookingOfCustomer from "../component/table/table_booking/tableHistoryBookingOfCustomer";
import ChangeSeatingForCustomerPage from "../pages/staff/change_seating_for_customer";
import CreateRoute from "../component/createNewRoute/CreateRoute";
import StationDetailPage from "../pages/admin/stationDetailPage";
import RouteDetailPage from "../pages/admin/routeDetailPage";

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
    path: "/station-detail/:id",
    element: <StationDetailPage />,
  },
  {
    path: "/route-detail/:id",
    element: <RouteDetailPage />,
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
  {
    path: "/create-route",
    element: <CreateRoute />,
  },
];

export const staffRoutes = [
  {
    path: "/change-ticket",
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
  {
    path: "/history-booking-by-id/:id",
    element: <TableHistoryBookingOfCustomer />,
  },
  {
    path: "/change-seating/:id",
    element: <ChangeSeatingForCustomerPage />,
  },
];
