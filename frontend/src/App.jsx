import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";

import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Courses from "./pages/Courses";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Issued from "./pages/Issued";


function App(){
  return(
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="courses" element={<Courses />} />
  <Route path="issued" element={<Issued />} />
  <Route path="profile" element={<Profile />} />
</Route>

        

      </Routes>

      </BrowserRouter>
  )
}
export default App;