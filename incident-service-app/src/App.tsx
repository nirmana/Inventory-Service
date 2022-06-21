import { Route, Routes, BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
