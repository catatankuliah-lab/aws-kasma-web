import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DetailPage from "./detailPage";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [navigate, token]);

    const [currentView, setCurrentView] = useState("index");
    const [detailId, setDetailId] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        nik: "",
        nama_driver: ""
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit, setLimit] = useState(10);

    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "50px",
        },
        {
            name: "NIK",
            selector: (row) => row.nik,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nama Driver",
            selector: (row) => row.nama_driver,
            sortable: true
        },
        {
            name: "",
            selector: (row) => (
                <button onClick={() => handleDetailClick(row)} className="btn btn-link">
                    <i className="bx bx-zoom-in text-priamry"></i>
                </button>
            ),
            sortable: false,
            width: "100px",
            style: {
                textAlign: "center",
            },
        },
    ];

    const customStyles = {
        table: { style: { backgroundColor: "transparent" } },
        headRow: {
            style: { backgroundColor: "transparent", borderBottom: "2px solid #ccc" },
        },
        rows: { style: { backgroundColor: "transparent" } },
        pagination: {
            style: {
                backgroundColor: "transparent",
                borderTop: "none",
                padding: "8px 0",
            },
        },
    };

    const loadData = async (page) => {
        setLoading(true);
        if (!token) {
            navigate("/");
        }
        try {
            const response = await axios.get(`http://localhost:3090/api/v1/driver`, {
                headers: { Authorization: token },
                params: { page, limit },
            });

            const fetchedData = Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data];
            setData(fetchedData);
            setFilteredData(fetchedData); // Set data awal ke filteredData juga
            setTotalRecords(response.data.totalData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit]);

    useEffect(() => {
        const filtered = data.filter((item) => {
            const matchNIK = item.nik.toLowerCase().includes(filters.nik.toLowerCase());
            const matchNamaDriver = item.nama_driver.toLowerCase().includes(filters.nama_driver.toLowerCase());
            return matchNIK && matchNamaDriver;
        });

        setFilteredData(filtered);
    }, [filters, data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDetailClick = (row) => {
        if (row.id_driver !== null) {
            setDetailId(row.id_driver);
            setCurrentView("detail");
        }
    };

    const handlePageChanges = (page, id = null) => {
        if (id !== null) {
            setDetailId(id);
        }
        setCurrentView(page);
    };

    const handleBackClick = () => {
        setCurrentView("index");
        loadData();
    };

    return (
        <div>
            {currentView === "index" && (
                <>
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <div className="mb-3">
                                <div className="divider text-start fw-bold">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">Data Driver</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <div className="divider text-start">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">Filter Data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Input pencarian */}
                        <div className="col-lg-12 mb-3">
                            <div className="row">
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">NIK</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={filters.nik}
                                        onChange={(e) => setFilters({ ...filters, nik: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Nama Driver</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={filters.nama_driver}
                                        onChange={(e) => setFilters({ ...filters, nama_driver: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <DataTable
                                columns={columns}
                                data={filteredData} // Gunakan data yang sudah difilter
                                pagination
                                paginationServer
                                paginationTotalRows={totalRecords}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={(newPerPage) => setLimit(newPerPage)}
                                currentPage={currentPage}
                                highlightOnHover
                                striped
                                progressPending={loading}
                                progressComponent={<span>Loading...</span>}
                                customStyles={customStyles}
                            />
                        </div>
                    </div>
                </>
            )}
            {currentView === "detail" && (
                <DetailPage
                    handlePageChanges={handlePageChanges}
                    detailId={detailId}
                    handleBackClick={handleBackClick}
                />
            )}
        </div>
    );
};

export default IndexPage;
