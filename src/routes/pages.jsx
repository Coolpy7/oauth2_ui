// import PricingPage from "views/Pages/PricingPage.jsx";
import LoginPage from "views/Pages/LoginPage.jsx";
import RegisterPage from "views/Pages/RegisterPage.jsx";
// material-ui-icons
import PersonAdd from "material-ui-icons/PersonAdd";
import Fingerprint from "material-ui-icons/Fingerprint";
import Dialpad from "material-ui-icons/Dialpad";
import ForgetPage from "views/Pages/ForgetPage";
import LockScreenPage from "views/Pages/LockScreenPage.jsx"
import LockOpen from "material-ui-icons/LockOpen";

const pagesRoutes = [
    {
        path: "/pages/register-page",
        name: "Register Page",
        short: "注册",
        mini: "RP",
        icon: PersonAdd,
        component: RegisterPage
    },
    {
        path: "/pages/login-page",
        name: "Login Page",
        short: "登录",
        mini: "LP",
        icon: Fingerprint,
        component: LoginPage
    },
    {
        path: "/pages/forget-page",
        name: "Forget Page",
        short: "忘记密码",
        mini: "LP",
        icon: Dialpad,
        component: ForgetPage
    },
    {
      path: "/pages/oauth2",
      name: "Oauth2 Page",
      short: "Oauth2",
      mini: "OA",
      icon: LockOpen,
      component: LockScreenPage
    },
    {
        redirect: true,
        path: "/pages",
        pathTo: "/pages/register-page",
        name: "Register Page"
    }
];

export default pagesRoutes;
