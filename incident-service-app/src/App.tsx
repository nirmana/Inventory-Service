import React, { Component } from "react";
import { Routes, Route, Router, BrowserRouter } from "react-router-dom";
import "./App.scss";
import Layout from "./pages/layout/layout";
import { Login } from "./pages/login/login";
import 'antd/dist/antd.min.css';

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
