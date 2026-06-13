import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/main/HomePage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import MunicipalDashboard from "./pages/municipal/MunicipalDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import RegisterCompanyPage from "./pages/RegisterCompanyPage";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-company" element={<RegisterCompanyPage />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />      
        <Route path="/municipal" element={
          <PrivateRoute>
            <MunicipalDashboard />
          </PrivateRoute>
        } />  
        <Route path="/company" element={
          <PrivateRoute>
            <CompanyDashboard />
          </PrivateRoute>
        } />    
        import UserDashboard from "./pages/user/dashboard/UserDashboard";
        <Route path="/dashboard" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;