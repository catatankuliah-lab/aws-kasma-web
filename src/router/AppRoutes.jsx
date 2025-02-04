import { Route, Routes } from "react-router-dom";
// Layout
import { DashboardPage } from "../pages/DashboardPage";
import { MaintenancePage } from "../pages/MaintenancePage";
import LoginPage from "../pages/auth/LoginPage";

import Role1PO from "../pages/1/po/indexPage";
import Role1Move from "../pages/1/move/indexPage";
import Role1LO from "../pages/1/losjt/indexPage";

import Role2PO from "../pages/2/po/indexPage";


import Role3DO from "../pages/3/do/indexPage";
import Role3LO from "../pages/3/lo/indexPage";

import Role4Penyaluran from "../pages/4/penyaluran/indexPage";


const AppRoutes = () => {
    const id_role = localStorage.getItem('id_role');
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            {id_role == '1' && (
                <>
                    <Route path="/1/dashboard" element={<DashboardPage />} />
                    <Route path="/1/po" element={<Role1PO />} />
                    <Route path="/1/move" element={<Role1Move />} />
                    <Route path="/1/losjt" element={<Role1LO />} />
                </>
            )}
            {id_role == '2' && (
                <>
                    <Route path="/2/dashboard" element={<DashboardPage />} />
                    <Route path="/2/po" element={<Role2PO />} />
                </>
            )}
            {id_role == '3' && (
                <>
                    <Route path="/3/dashboard" element={<DashboardPage />} />
                    <Route path="/3/dockout" element={<Role3DO />} />
                    <Route path="/3/lo" element={<Role3LO />} />
                </>
            )}
            {id_role == '4' && (
                <>
                    <Route path="/4/dashboard" element={<DashboardPage />} />
                    <Route path="/4/penyaluran" element={<Role4Penyaluran />} />
                </>
            )}
            <Route path="*" element={<MaintenancePage />} />
        </Routes>
    )
}
export default AppRoutes;