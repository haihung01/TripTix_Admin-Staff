import React from "react";
import { Route, Routes } from "react-router-dom";
// import LayoutPublic from "../theme/layoutPublic";
import SignIn from "../auth/login";
import ErrorPage from "../component/404/404page";
import LayoutPrivate from "../theme/layoutPrivate";
import AuthRoute from "./auth-route";
import { adminRoutes, publicRoutes, staffRoutes } from "./routesByRole";
import { ROLES } from "./roles";
import Unauthorized from "../component/403/unauthorized";
import CheckRoute from "./check-route";
import GetOverStarted from "../pages/main/getOverStarted";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<CheckRoute />}>
        <Route path="/" element={<GetOverStarted />} />
      </Route>
      <Route element={<CheckRoute />}>
        <Route path="/login-page" element={<SignIn />} />
      </Route>
      <Route
        key="home"
        element={<AuthRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]} />}
      >
        <Route key="layout_public" element={<LayoutPrivate />}>
          {publicRoutes.map((route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}
        </Route>
      </Route>
      <Route key="pvr1" element={<AuthRoute allowedRoles={[ROLES.STAFF]} />}>
        <Route key="layout_public" element={<LayoutPrivate />}>
          {staffRoutes.map((route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}
        </Route>
      </Route>
      <Route key="pvr1" element={<AuthRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route key="layout_public" element={<LayoutPrivate />}>
          {adminRoutes.map((route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
      <Route path="/unauthorized" element={<Unauthorized />}></Route>
    </Routes>
  );
};

export default AppRoutes;