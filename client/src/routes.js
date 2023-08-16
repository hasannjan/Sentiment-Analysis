import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import Sentiment from "views/Sentiment.js"

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/sentiment",
    name: "Sentiment",
    icon: "nc-icon nc-paper-2",
    component: Sentiment,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin",
  }
];

export default dashboardRoutes;
