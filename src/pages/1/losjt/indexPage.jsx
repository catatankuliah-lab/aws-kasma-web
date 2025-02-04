import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetailPage from './detailPage';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const [currentView, setCurrentView] = useState('index');

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);
    const [alokasiInit, setAlokasiInit] = useState(null);

    const [detailId, setDetailId] = useState(null);

    const [kantorOption, setKantorOption] = useState([]);
    const [selectedKantor, setSelectedKantor] = useState(null);
    const [selectedKantorInit, setSelectedKantorInit] = useState(null);

    const [dataLO, setDataLO] = useState([]);


    const [formFilter, setFormFilter] = useState({
        id_alokasi: null,
        id_kantor: null,
        tanggal_awal: null,
        tanggal_akhir: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const fetchAlokasi = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get('http://localhost:3089/api/v1/alokasi', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_alokasi,
                    label: dataitem.keterangan_alokasi
                }));
                setAlokasiOption(datafetch);
            } else {
                setAlokasiOption([]);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Data Alokasi',
                text: 'Data Alokasi Tidak Ditemukan',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
            setAlokasiOption([]);
        }
    };

    useEffect(() => {
        fetchAlokasi();
    }, [token]);

    const handleAlokasiChange = (selectedOption) => {
        setSelectedAlokasi(selectedOption);
        setAlokasiInit(selectedOption.value);
        setFormFilter((prevState) => ({
            ...prevState,
            id_alokasi: selectedOption ? selectedOption.value : null
        }));
    };

    const fetchKantor = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get('http://localhost:3089/api/v1/kantor', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_kantor,  // Fix: pastikan id_kantor yang digunakan
                    label: dataitem.nama_kantor
                }));
                setKantorOption(datafetch);
            } else {
                setKantorOption([]);
            }
        } catch (error) {
            console.log(error);
            setKantorOption([]);
        }
    };

    useEffect(() => {
        fetchKantor();
    }, [token]);

    const handleKantorChange = (selectedOption) => {
        setSelectedKantor(selectedOption);
        setSelectedKantorInit(selectedOption.value);
        setFormFilter((prevState) => ({
            ...prevState,
            id_kantor: selectedOption ? selectedOption.value : null
        }));
    };

    const handlePageChange = (page, id = null, idkantor) => {
        if (id !== null) {
            setAlokasiInit(selectedAlokasi.value);
            setSelectedKantorInit(idkantor);
            setDetailId(id);
        }
        setCurrentView(page);
    };

    const handleBackClick = () => {
        setCurrentView("index");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const getLO = async () => {
        if (!selectedAlokasi) {
            Swal.fire({
                title: 'Filter Data',
                text: 'Silahkan pilih alokasi terlebih dahulu',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
        }
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const queryParams = new URLSearchParams(formFilter).toString();
            const response = await axios.get(`http://localhost:3089/api/v1/lo/filter?${queryParams}`, {
                headers: {
                    Authorization: token,
                }
            });
            if (response.data.data) {
                const data = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setDataLO(data);
            } else {
                setDataLO([]);
                console.log('No data found for the filters');
            }
        } catch (error) {
            setDataLO([]);
            console.error('Error fetching PO data:', error);
        }
    };

    return (
        <div>
            {currentView === 'index' && (
                <>
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <div className="mb-3">
                                <div className="divider text-start fw-bold">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">Data Loading Order</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_lokasi" className="form-label">Alokasi</label>
                            <Select
                                id="id_lokasi"
                                name="id_lokasi"
                                value={selectedAlokasi}
                                onChange={handleAlokasiChange}
                                options={alokasiOption}
                                placeholder="Pilih Alokasi"
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_awal" className="form-label">Tanggal Awal</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_awal" name='tanggal_awal' onChange={handleChange} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_akhir" className="form-label">Tanggal Akhir</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_akhir" name='tanggal_akhir' onChange={handleChange} />
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_kantor" className="form-label">Kantor</label>
                            <Select
                                id="id_kantor"
                                name="id_kantor"
                                value={selectedKantor}
                                onChange={handleKantorChange}
                                options={kantorOption}
                                placeholder="Pilih Kantor"
                                isClearable
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">Tampilkan</label>
                            <button type="button" onClick={getLO} className="btn btn-primary w-100">TAMPILKAN</button>
                        </div>
                        <div className="col-lg-12 mt-3">
                            <div className="row">
                                <div className="col-md-12 mb-4 mb-md-0">
                                    <div className="accordion mt-3" id="accordion_po">
                                        {dataLO.map(itemlo => (
                                            <div key={itemlo.id_lo} className="card accordion-item">
                                                <h2 className="accordion-header px-2" id={`heading${itemlo.id_lo}`}>
                                                    <button
                                                        type="button"
                                                        className={`accordion-button accordion-button-primary collapsed`}
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#accordion${itemlo.id_lo}`}
                                                        aria-expanded="false"
                                                        aria-controls={`accordion${itemlo.id_lo}`}
                                                    >
                                                        <span className={`fw-bold ${itemlo.status_lo == "SUDAH UPLOAD" ? "text-success" : "text-primary"}`} >{formatDate(itemlo.tanggal_lo)} | {itemlo.nomor_lo}</span>
                                                    </button>
                                                </h2>
                                                <div id={`accordion${itemlo.id_lo}`} className="accordion-collapse collapse" data-bs-parent="#accordion_po">
                                                    <div className="accordion-body" style={{ marginTop: "-15px" }} >
                                                        <div className="px-2">
                                                            <hr />
                                                            <div className="col-md-12 col-sm-12 mt-0 mt-md-3">
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Tanggal PO : {formatDate(itemlo.tanggal_lo)}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Kantor Cabang : {itemlo.nama_kantor}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Titik Muat : {itemlo.titik_muat}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Jenis Mobil : {itemlo.jenis_mobil}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Nopol Mobil : {itemlo.nopol_mobil}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Nama Driver : {itemlo.nama_driver}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Telpon Driver : {itemlo.telpon_driver}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Total Muatan Ayam : {(itemlo.jenis_muatan_json.ayam).toLocaleString('de-DE')}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Total Muatan Telur : {(itemlo.jenis_muatan_json.telur).toLocaleString('de-DE')}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Status LO : {itemlo.status_lo}
                                                                </p>
                                                                <button className="btn btn-link p-0 mt-3" onClick={() => handlePageChange('detail', itemlo.id_lo, itemlo.id_kantor)}>
                                                                    <i className="tf-icons bx bx-edit me-2"></i> DETAIL
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {currentView === 'detail' && <DetailPage handlePageChange={handlePageChange} detailId={detailId} alokasiInit={alokasiInit} selectedKantorInit={selectedKantorInit} handleBackClick={handleBackClick} />}
        </div>
    );
};

export default IndexPage;