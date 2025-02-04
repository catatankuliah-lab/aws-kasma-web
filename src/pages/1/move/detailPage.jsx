import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';

const DetailPage = ({ detailId, alokasiInit, handleBackClick }) => {

    // console.clear();

    const token = localStorage.getItem('token');

    const inputRef = useRef(null);

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);
    const [move, setMove] = useState([]);
    // const [itemPO, setItemPO] = useState([]);

    const fetchMove = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/move/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            console.log(response.data.data);
            setMove(response.data.data);
        } catch (error) {
            console.log(error);
            setMove([]);
        }
    };

    useEffect(() => {
        fetchMove();
    }, [token, detailId]);

    // const fetchItemPO = async () => {
    //     if (!token) {
    //         navigate('/');
    //     }
    //     try {
    //         const response = await axios.get(`http://localhost:3089/api/v1/itempo/po/${detailId}`, {
    //             headers: {
    //                 Authorization: token
    //             }
    //         });
    //         if (response.data.data.length !== 0) {
    //             const datafetch = response.data.data.map(dataitem => ({
    //                 nomor_move: dataitem.nomor_move,
    //                 tanggal_move: dataitem.tanggal_move,
    //                 id_item_po: dataitem.id_item_po,
    //                 id_po: dataitem.id_po,
    //                 jenis_mobil: dataitem.jenis_mobil,
    //                 nopol_mobil: dataitem.nopol_mobil,
    //                 nama_driver: dataitem.nama_driver,
    //                 telpon_driver: dataitem.telpon_driver,
    //                 jenis_muatan: dataitem.jenis_muatan_json.ayam,
    //                 jumlah_muatan: dataitem.jumlah_muatan_json.telur
    //             }));
    //             setItemPO(datafetch);
    //         } else {
    //             setItemPO([]);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         setItemPO([]);
    //     }
    // };

    // useEffect(() => {
    //     fetchItemPO();
    // }, [token, detailId]);

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

    const formattedDate = move?.tanggal_move ? new Date(move.tanggal_move).toISOString().split("T")[0] : "";

    // const totalByJenisMuatan = itemPO.reduce((acc, item) => {
    //     if (!acc[item.jenis_muatan]) {
    //         acc[item.jenis_muatan] = 0;
    //     }
    //     acc[item.jenis_muatan] += item.jumlah_muatan;
    //     return acc;
    // }, {});

    return (
        
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Detail Move</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12 mb-3">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Move.
                </div>
            </div>
            <div className="col-md-12">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="divider text-start">
                            <div className="divider-text">
                                <span className="menu-header-text fs-6">Informasi Move</span>
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
                        <label htmlFor="nomor_move" className="form-label">Nomor Move</label>
                        <input className="form-control" type="text" id="nomor_move" name='nomor_move' placeholder="Nomor Move" value={move?.nomor_move} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="tanggal_move" className="form-label">Tanggal Move</label>
                        <input className="form-control text-uppercase" type="date" id="tanggal_move" name='tanggal_move' ref={inputRef} defaultValue={formattedDate} placeholder="Tanggal Rencana Salur" required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="customer" className="form-label">Customer</label>
                        <input className="form-control" type="text" id="customer" name='customer' placeholder="Customer" value={move?.customer} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jenis_mobil" className="form-label">Jenis Mobil</label>
                        <input className="form-control" type="text" id="jenis_mobil" name='jenis_mobil' placeholder="Titik Muat" value={move?.jenis_mobil} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nopol_mobil" className="form-label">Nopol Mobil</label>
                        <input className="form-control" type="text" id="nopol_mobil" name='nopol_mobil' placeholder="Titik Bongkar" value={move?.nopol_mobil} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_driver" className="form-label">Nama Driver</label>
                        <input className="form-control" type="text" id="nama_driver" name='nama_driver' placeholder="Nama Driver" value={move?.nama_driver} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="telpon_driver" className="form-label">Telepon Driver</label>
                        <input className="form-control" type="text" id="telpon_driver" name='telpon_driver' placeholder="Status Move" value={move?.telpon_driver} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="titik_muat" className="form-label">Titik Muat</label>
                        <input className="form-control" type="text" id="titik_muat" name='titik_muat' placeholder="Titik Muat" value={move?.titik_muat} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="titik_bongkar" className="form-label">Titik Bongkar</label>
                        <input className="form-control" type="text" id="titik_bongkar" name='titik_bongkar' placeholder="Titik Bongkar" value={move?.titik_bongkar} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jam_stand_by" className="form-label">Jam Standby</label>
                        <input className="form-control" type="text" id="jam_stand_by" name='jam_stand_by' placeholder="00:00" value={`${move?.jam_stand_by} WIB`} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jenis_muatan" className="form-label">Jenis Muatan</label>
                        <input className="form-control" type="text" id="jenis_muatan" name='jenis_muatan' placeholder="Jenis Muatan" value={move?.jenis_muatan} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jumlah_muatan" className="form-label">Jumlah Muatan</label>
                        <input className="form-control" type="text" id="jumlah_muatan" name='jumlah_muatan' placeholder="Jumlah Muatan" value={`${move?.jumlah_muatan} KG`} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="status_move" className="form-label">Status</label>
                        <input className="form-control" type="text" id="status_move" name='status_move' placeholder="Status Move" value={move?.status_move} required readOnly />
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