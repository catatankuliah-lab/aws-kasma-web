import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { MaintenancePage } from "../pages/MaintenancePage";
import LoginPage from "../pages/auth/LoginPage";

import Role7Driver from "../pages/7/driver/indexPage";
import Role7Dashboard from "../pages/7/dashboard/indexPage";

import Role9PO from "../pages/9/po/indexPage";
import Role9Customer from "../pages/9/customer/indexPage";
import Role9Driver from "../pages/9/driver/indexPage";

import Role10PO from "../pages/10/po/indexPage";

import Role12Armada from "../pages/12/armada/indexPage";
import Role12Dashboard from "../pages/12/dashboard/indexPage";

const AppRoutes = () => {
    const id_role = localStorage.getItem('id_role');
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            {id_role == "7" && (
                <>
                    <Route path="/7/dashboard" element={<Role7Dashboard />} />
                    <Route path="/7/driver" element={<Role7Driver />} />
                </>
            )}
            {id_role == "9" && (
                <>
                    <Route path="/9/dashboard" element={<DashboardPage />} />
                    <Route path="/9/po" element={<Role9PO />} />
                    <Route path="/9/customer" element={<Role9Customer />} />
                    <Route path="/9/armada" element={<Role9PO />} />
                    <Route path="/9/driver" element={<Role9Driver />} />
                </>
            )}
            {id_role == "10" && (
                <>
                    <Route path="/10/dashboard" element={<DashboardPage />} />
                    <Route path="/10/po" element={<Role10PO />} />
                </>
            )}
            {id_role == "12" && (
                <>
                    <Route path="/12/dashboard" element={<Role12Dashboard />} />
                    <Route path="/12/armada" element={<Role12Armada />} />
                </>
            )}
            <Route path="*" element={<MaintenancePage />} />
        </Routes>
    );
}
export default AppRoutes;