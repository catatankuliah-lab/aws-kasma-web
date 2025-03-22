import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import AddPage from "./addPage";
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

    const jeniskendaraanInit = (id) => {
        console.log("Jenis kendaraan dipilih:", id);
    };

    const [currentView, setCurrentView] = useState("index");
    const [detailId, setDetailId] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        nama_jenis_kendaraan: "",
        nopol_armada: "",
        status_armada: ""
    });
    const [tempFilters, setTempFilters] = useState(filters);
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
            name: "Jenis kendaraan",
            selector: (row) => row.nama_jenis_kendaraan,
            sortable: true,
            width: "200px",
        },
        {
            name: "NOPOL",
            selector: (row) => row.nopol_armada,
            sortable: true,
            width: "200px",
        },
        {
            name: "Status",
            selector: (row) => row.status_armada,
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
            const response = await axios.get(`http://localhost:3090/api/v1/armada`, {
                headers: { Authorization: token },
                params: {
                    page, limit, nama_jenis_kendaraan: filters.nama_jenis_kendaraan,
                    nopol_armada: filters.nopol_armada, status_armada: filters.status_armada
                },
            });

            const fetchedData = Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data];
            setData(fetchedData);
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
        setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
        loadData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]); // Fetch ulang data saat filter berubah

    useEffect(() => {
        const filtered = data.filter((item) => {
            const matchNamaJenisKendaraan = item.nama_jenis_kendaraan.toLowerCase().includes(filters.nama_jenis_kendaraan.toLowerCase());
            const matchNopolArmada = item.nopol_armada.toLowerCase().includes(filters.nopol_armada.toLowerCase());
            const matchStatusArmada = item.status_armada.toLowerCase().includes(filters.status_armada.toLowerCase());
            return matchNamaJenisKendaraan && matchNopolArmada && matchStatusArmada;
        });
        setFilteredData(filtered);
    }, [filters, data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDetailClick = (row) => {
        if (row.id_armada !== null) {
            setDetailId(row.id_armada);
            setCurrentView("detail");
            jeniskendaraanInit(row.id_jenis_kendaraan); // Inisialisasi jenis kendaraan
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
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <div className="divider text-start fw-bold">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">Data Armada</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Input pencarian */}
                        <div className="col-lg-12 mb-3">
                            <div className="row">
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Jenis Kendaraan</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.nama_jenis_kendaraan}
                                        onChange={(e) => setTempFilters({ ...tempFilters, nama_jenis_kendaraan: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Nopol Armada</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.nopol_armada}onChange={(e) => setTempFilters({ ...tempFilters, nopol_armada: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Status Armada</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.status_armada}onChange={(e) => setTempFilters({ ...tempFilters, status_armada: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Proses</label>
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => setFilters(tempFilters)}
                                    >
                                        TAMPILKAN
                                    </button>
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
            {currentView === "add" && (
                <AddPage
                    handlePageChanges={handlePageChanges}
                    handleBackClick={handleBackClick}
                />
            )}
            {currentView === "detail" && (
                <DetailPage
                    handlePageChanges={handlePageChanges}
                    detailId={detailId}
                    jeniskendaraanInit={jeniskendaraanInit}
                    handleBackClick={handleBackClick}
                />
            )}
        </div>
    );
};

export default IndexPage;
