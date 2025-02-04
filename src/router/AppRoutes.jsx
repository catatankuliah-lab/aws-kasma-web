import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { MaintenancePage } from "../pages/MaintenancePage";
import LoginPage from "../pages/auth/LoginPage";

import Role7Driver from "../pages/7/driver/indexPage";

const AppRoutes = () => {
    const id_role = localStorage.getItem('id_role');
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            {id_role == "7" && (
                <>
                    <Route path="/7/dashboard" element={<DashboardPage />} />
                    <Route path="/7/driver" element={<Role7Driver />} />
                </>
            )}
            <Route path="*" element={<MaintenancePage />} />
        </Routes>
    );
}
export default AppRoutes;