import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';

const DetailPage = ({ detailId, alokasiInit, handleBackClick }) => {

    const token = localStorage.getItem('token');

    const inputRef = useRef(null);

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);
    const [lo, setLO] = useState([]);
    const [itemLO, setItemLO] = useState([]);

    const fetchLO = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/lo/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            setLO(response.data.data);
        } catch (error) {
            console.log(error);
            setLO([]);
        }
    };

    useEffect(() => {
        fetchLO();
    }, [token, detailId]);

    const fetchItemLO = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/itemlo/lo/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    nomor_lo: dataitem.nomor_lo,
                    tanggal_lo: dataitem.tanggal_lo,
                    id_item_po: dataitem.id_item_po,
                    id_po: dataitem.id_po,
                    jenis_mobil: dataitem.jenis_mobil,
                    nopol_mobil: dataitem.nopol_mobil,
                    nama_driver: dataitem.nama_driver,
                    telpon_driver: dataitem.telpon_driver,
                    jumlah_muatan_ayam: dataitem.jumlah_muatan_ayam,
                    jumlah_muatan_telur: dataitem.jumlah_muatan_telur,
                    titik_bongkar: dataitem.titik_bongkar,
                    nama_provinsi: dataitem.nama_provinsi,
                    nama_kabupaten_kota: dataitem.nama_kabupaten_kota,
                    nama_kecamatan: dataitem.nama_kecamatan,
                    nama_desa_kelurahan: dataitem.nama_desa_kelurahan
                }));
                setItemLO(datafetch);
            } else {
                setItemLO([]);
            }
        } catch (error) {
            console.log(error);
            setItemLO([]);
        }
    };

    useEffect(() => {
        fetchItemLO();
    }, [token, detailId]);

    useEffect(() => {
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
                setAlokasiOption([]);
            }
        };
        fetchAlokasi();
    }, [token]);

    useEffect(() => {
        if (alokasiOption.length > 0 && alokasiInit) {
            const initialValue = alokasiOption.find(option => option.value === alokasiInit) || null;
            setSelectedAlokasi(initialValue);
        }
    }, [alokasiOption, alokasiInit]);

    const handleAlokasiChange = (selectedOption) => {
        setSelectedAlokasi(selectedOption);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const formattedDate = lo?.tanggal_lo ? new Date(lo.tanggal_lo).toISOString().split("T")[0] : "";

    // Mengelompokkan data berdasarkan titik bongkar
    const groupedData = itemLO.reduce((acc, item) => {
        if (!acc[item.titik_bongkar]) {
            acc[item.titik_bongkar] = {
                items: [],
                totalAyam: 0,
                totalTelur: 0,
            };
        }
        acc[item.titik_bongkar].items.push(item);
        acc[item.titik_bongkar].totalAyam += item.jumlah_muatan_ayam;
        acc[item.titik_bongkar].totalTelur += item.jumlah_muatan_telur;

        return acc;
    }, {});

    // Menghitung total keseluruhan
    const totalKeseluruhan = itemLO.reduce(
        (acc, item) => {
            acc.totalAyam += item.jumlah_muatan_ayam;
            acc.totalTelur += item.jumlah_muatan_telur;
            return acc;
        },
        { totalAyam: 0, totalTelur: 0 }
    );


    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Detail Loading Order</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12 mb-3">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Loading Order.
                </div>
            </div>
            <div className="col-md-12">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="divider text-start">
                            <div className="divider-text">
                                <span className="menu-header-text fs-6">Informasi Loading Order</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_alokasi" className="form-label">Alokasi</label>
                        <Select
                            id="id_alokasi"
                            name="id_alokasi"
                            value={selectedAlokasi}
                            onChange={handleAlokasiChange}
                            options={alokasiOption}
                            placeholder="Pilih Alokasi"
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nomor_lo" className="form-label">Nomor LO</label>
                        <input className="form-control" type="text" id="nomor_lo" name='nomor_lo' placeholder="Nomor PO" value={lo?.nomor_lo} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="tanggal_lo" className="form-label">Tanggal LO</label>
                        <input className="form-control text-uppercase" type="date" id="tanggal_lo" name='tanggal_lo' ref={inputRef} defaultValue={formattedDate} placeholder="" required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="titik_muat" className="form-label">Titik Muat</label>
                        <input className="form-control" type="text" id="titik_muat" name='titik_muat' placeholder="Titik Muat" value={lo?.lo_titik_muat} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jenis_mobil" className="form-label">Jenis Mobil</label>
                        <input className="form-control" type="text" id="jenis_mobil" name='jenis_mobil' placeholder="Jenis Mobil" value={lo?.jenis_mobil} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nopol_mobil" className="form-label">Nopol Mobil</label>
                        <input className="form-control" type="text" id="nopol_mobil" name='nopol_mobil' placeholder="Nopol Mobil" value={lo?.nopol_mobil} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_driver" className="form-label">Nama Driver</label>
                        <input className="form-control" type="text" id="nama_driver" name='nama_driver' placeholder="Nama Driver" value={`${lo?.nama_driver}`} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="telpon_driver" className="form-label">Telpon Driver</label>
                        <input className="form-control" type="text" id="telpon_driver" name='telpon_driver' placeholder="Telpon Driver" value={lo?.telpon_driver} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="status_lo" className="form-label">Status LO</label>
                        <input className="form-control" type="text" id="status_lo" name='status_lo' placeholder="Telpon Driver" value={lo?.status_lo} required readOnly />
                    </div>
                    <div className="col-lg-12 mt-2">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Item Loading Order</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 mb-4 mb-md-0">
                        <div className="table-responsive text-nowrap">
                            <table className="table" style={{ fontSize: "13px" }}>
                                <thead>
                                    <tr>
                                        <th className='fw-bold' >No</th>
                                        <th className='fw-bold'>Titik Bagi</th>
                                        <th className='fw-bold'>Provinsi</th>
                                        <th className='fw-bold'>Kabupaten/Kota</th>
                                        <th className='fw-bold'>Kecamatan</th>
                                        <th className='fw-bold'>Desa/Kelurahan</th>
                                        <th className='fw-bold'>Muatan Ayam</th>
                                        <th className='fw-bold'>Muatan Telur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Render data per titik bongkar */}
                                    {Object.entries(groupedData).map(([titik_bongkar, group], groupIndex) => (
                                        <React.Fragment key={groupIndex}>
                                            {/* Render data untuk tiap item di titik bongkar */}
                                            {group.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.titik_bongkar}</td>
                                                    <td>{item.nama_provinsi}</td>
                                                    <td>{item.nama_kabupaten_kota}</td>
                                                    <td>{item.nama_kecamatan}</td>
                                                    <td>{item.nama_desa_kelurahan}</td>
                                                    <td>{item.jumlah_muatan_ayam.toLocaleString('id-ID')}</td>
                                                    <td>{item.jumlah_muatan_telur.toLocaleString('id-ID')}</td>
                                                </tr>
                                            ))}

                                            {/* Render total per titik bongkar */}
                                            <tr>
                                                <td colSpan="6" className="fw-bold">Total di {titik_bongkar}</td>
                                                <td className="fw-bold">{group.totalAyam.toLocaleString('id-ID')}</td>
                                                <td className="fw-bold">{group.totalTelur.toLocaleString('id-ID')}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))}

                                    {/* Jika tidak ada data */}
                                    {itemLO.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="text-center">Data tidak tersedia</td>
                                        </tr>
                                    )}

                                    {/* Render total keseluruhan */}
                                    {itemLO.length > 0 && (
                                        <tr className="table-secondary">
                                            <td colSpan="6" className="fw-bold">Total Keseluruhan</td>
                                            <td className="fw-bold">{totalKeseluruhan.totalAyam.toLocaleString('id-ID')}</td>
                                            <td className="fw-bold">{totalKeseluruhan.totalTelur.toLocaleString('id-ID')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

DetailPage.propTypes = {
    detailId: PropTypes.number.isRequired,
    alokasiInit: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired
};

export default DetailPage;