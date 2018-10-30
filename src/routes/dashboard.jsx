import Dashboard from "views/Dashboard/Dashboard.jsx";
import Wizard from "views/Forms/Wizard.jsx";
import Devs from "views/PassDevs/Devs.jsx";
import Sets from "views/PassDevs/Sets.jsx";
import AuthManage from "views/Auths/Auths.jsx";
import DevManage from "views/DevManage/DevManage.jsx";
// material-ui-icons
import DashboardIcon from "material-ui-icons/Dashboard";
import ContentPaste from "material-ui-icons/ContentPaste";
import GridOn from "material-ui-icons/GridOn";

import Apps from "material-ui-icons/Apps";
import Place from "material-ui-icons/CheckCircle";

// var pages = [
//   {
//     path: "/timeline-page",
//     name: "Timeline Page",
//     mini: "TP",
//     component: TimelinePage
//   },
//   {
//     path: "/user-page",
//     name: "User Profile",
//     mini: "UP",
//     component: UserProfile
//   },
//   {
//     path: "/rtl/rtl-support-page",
//     name: "RTL Support",
//     mini: "RS",
//     component: RTLSupport
//   }
// ].concat(pagesRoutes);

var dashRoutes = [
    {
        path: "/dashboard",
        name: "我的名片",
        icon: DashboardIcon,
        component: Dashboard
    },
    {
        collapse: true,
        path: "/forms",
        name: "用户中心",
        state: "openForms",
        icon: ContentPaste,
        views: [
            {
                path: "/forms/wizard",
                name: "账户信息管理",
                mini: "PF",
                component: Wizard
            },
        ]
    },
    {
        collapse: true,
        path: "/auths",
        name: "应用授权管理",
        state: "openTables",
        icon: GridOn,
        views: [
            {
                path: "/auths/auths",
                name: "授权应用列表",
                mini: "AT",
                component: AuthManage
            },
        ]
    },
    {
        collapse: true,
        path: "/devs",
        name: "开发者",
        state: "devforms",
        icon: Apps,
        views: [
            {
                path: "/devs/devmanage",
                name: "我的应用",
                mini: "MA",
                component: DevManage
            },
        ]
    },
    {
        collapse: true,
        path: "/passdevs",
        name: "系统管理",
        state: "openDevs",
        icon: Place,
        views: [
            {
                path: "/passdevs/devs",
                name: "开发者申请审核",
                mini: "DC",
                component: Devs
            },
            {
                path: "/passdevs/sets",
                name: "系统参数配置",
                mini: "SS",
                component: Sets
            },
        ]
    },
    // {
    //   collapse: true,
    //   path: "-page",
    //   name: "Pages",
    //   state: "openPages",
    //   icon: Image,
    //   views: pages
    // },
    // {
    //   collapse: true,
    //   path: "/components",
    //   name: "Components",
    //   state: "openComponents",
    //   icon: Apps,
    //   views: [
    //     {
    //       path: "/components/buttons",
    //       name: "Buttons",
    //       mini: "B",
    //       component: Buttons
    //     },
    //     {
    //       path: "/components/grid-system",
    //       name: "Grid System",
    //       mini: "GS",
    //       component: GridSystem
    //     },
    //     {
    //       path: "/components/panels",
    //       name: "Panels",
    //       mini: "P",
    //       component: Panels
    //     },
    //     {
    //       path: "/components/sweet-alert",
    //       name: "Sweet Alert",
    //       mini: "SA",
    //       component: SweetAlert
    //     },
    //     {
    //       path: "/components/notifications",
    //       name: "Notifications",
    //       mini: "N",
    //       component: Notifications
    //     },
    //     { path: "/components/icons", name: "Icons", mini: "I", component: Icons },
    //     {
    //       path: "/components/typography",
    //       name: "Typography",
    //       mini: "T",
    //       component: Typography
    //     }
    //   ]
    // },
    // {
    //   collapse: true,
    //   path: "/forms",
    //   name: "From",
    //   state: "openForms",
    //   icon: ContentPaste,
    //   views: [
    //     {
    //       path: "/forms/regular-forms",
    //       name: "Regular Forms",
    //       mini: "RF",
    //       component: RegularForms
    //     },
    //     {
    //       path: "/forms/extended-forms",
    //       name: "Extended Forms",
    //       mini: "EF",
    //       component: ExtendedForms
    //     },
    //     {
    //       path: "/forms/validation-forms",
    //       name: "Validation Forms",
    //       mini: "VF",
    //       component: ValidationForms
    //     },
    //     { path: "/forms/wizard", name: "Wizard", mini: "W", component: Wizard }
    //   ]
    // },
    // {
    //   collapse: true,
    //   path: "/tables",
    //   name: "Tables",
    //   state: "openTables",
    //   icon: GridOn,
    //   views: [
    //     {
    //       path: "/tables/regular-tables",
    //       name: "Regular Tables",
    //       mini: "RT",
    //       component: RegularTables
    //     },
    //     {
    //       path: "/tables/extended-tables",
    //       name: "Extended Tables",
    //       mini: "ET",
    //       component: ExtendedTables
    //     },
    //     {
    //       path: "/tables/react-tables",
    //       name: "React Tables",
    //       mini: "RT",
    //       component: ReactTables
    //     }
    //   ]
    // },
    // {
    //   collapse: true,
    //   path: "/maps",
    //   name: "Maps",
    //   state: "openMaps",
    //   icon: Place,
    //   views: [
    //     {
    //       path: "/maps/google-maps",
    //       name: "Google Maps",
    //       mini: "GM",
    //       component: GoogleMaps
    //     },
    //     {
    //       path: "/maps/full-screen-maps",
    //       name: "Full Screen Map",
    //       mini: "FSM",
    //       component: FullScreenMap
    //     },
    //     {
    //       path: "/maps/vector-maps",
    //       name: "Vector Map",
    //       mini: "VM",
    //       component: VectorMap
    //     }
    //   ]
    // },
    // { path: "/widgets", name: "Widgets", icon: WidgetsIcon, component: Widgets },
    // { path: "/charts", name: "Charts", icon: Timeline, component: Charts },
    // { path: "/calendar", name: "Calendar", icon: DateRange, component: Calendar },
    {redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard"}
];
export default dashRoutes;
