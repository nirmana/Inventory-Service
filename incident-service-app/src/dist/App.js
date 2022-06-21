"use strict";
exports.__esModule = true;
var react_router_dom_1 = require("react-router-dom");
var layout_1 = require("./pages/layout/layout");
require("antd/dist/antd.min.css");
var Home_1 = require("./pages/home/Home");
var Login_1 = require("./pages/login/Login");
var PrivateRoutes_1 = require("./components/privateRoutes/PrivateRoutes");
require("./App.scss");
// const Home = React.lazy(() => import("./pages/home/Home"));
// const Login = React.lazy(() => import("./pages/login/Login"));
function App() {
    return (React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(layout_1["default"], null,
            React.createElement(react_router_dom_1.Routes, null,
                React.createElement(react_router_dom_1.Route, { path: "/login", element: React.createElement(Login_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(PrivateRoutes_1.RequireAuth, { redirectTo: "/login" },
                        React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(Home_1["default"], null) })) })))));
}
exports["default"] = App;
