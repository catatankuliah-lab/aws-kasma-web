import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const DetailPage = ({ detailId, idCustomerInit, idArmadaInit, idDriverInit, handleBackClick }) => {
    const token = localStorage.getItem('token');

    const modules = {
        toolbar: [
            [{ color: [] }, { background: [] }],
        ],
    };

    const formats = [
        "color"
    ];

    const [formData, setFormData] = useState({
        nomor_po: "",
        tanggal_po: "",
        jam_pemesanan_po: "",
        jam_muat: "",
        id_customer: "",
        id_armada: "",
        id_driver: "",
        destination: "",
        status_po: ""
    });

    const [formDataReguler, setFormDataReguler] = useState({
        id_kas_jalan: "",
        id_po: "",
        jarak_isi: "",
        jarak_kosong: "",
        jam_tunggu: "",
        gaji_driver: "",
        e_toll: "",
        keterangan_rute: "",
        tonase: "",
        rasio_perkalian: "",
        rasio_perkalian_kosong: ""
    });

    const [formDataKosongan, setFormDataKosongan] = useState({
        id_kas_jalan: "",
        id_po: "",
        jarak_isi: "",
        jarak_kosong: "",
        jam_tunggu: "",
        gaji_driver: "",
        e_toll: "",
        keterangan_rute: "",
        tonase: "",
        rasio_perkalian: "",
        rasio_perkalian_kosong: ""
    });
    const [formDataTitikBongkar, setFormDataTitikBongkar] = useState({
        id_titik_bongkar: "",
        id_po: "",
        id_kabupaten_kota: "",
        alamat_titik_bongkar: "",
        jam_bongkar: "",
        shareloc: "",
        nama_penerima: "",
        nomor_penerima: ""
    });
    const [titikBongkar, setTitikBongkar] = useState([]);
    const [titikBongkarOption, setTitikBongkarOption] = useState([]);
    const [selectedTitikBongkar, setSelectedTitikBongkar] = useState(null);
    const fetchKabupaten = async () => {
        try {
            const response = await axios.get('http://localhost:3090/api/v1/kabupaten-kota', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_kabupaten_kota,
                    label: dataitem.nama_kabupaten_kota,
                }));
                setTitikBongkarOption(datafetch);
            } else {
                setTitikBongkarOption([]);
            }
        } catch (error) {
            console.log(error);
            setTitikBongkarOption([]);
        }
    };
    const handleTitikBongkarChange = (selectedOption) => {
        setSelectedTitikBongkar(selectedOption);
        setFormData((prevData) => ({
            ...prevData,
            id_kabupaten_kota: selectedOption.value
        }));
    };

    const fetchTitikBongkar = async () => {
        try {
            const response = await axios.get(`http://localhost:3090/api/v1/titikbongkar/po/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    id_titik_bongkar: dataitem.id_titik_bongkar,
                    alamat_titik_bongkar: dataitem.alamat_titik_bongkar,
                    shareloc: dataitem.shareloc,
                    nama_penerima: dataitem.nama_penerima,
                    nomor_penerima: dataitem.nomor_penerima,
                    nama_kabupaten_kota: dataitem.nama_kabupaten_kota
                }));
                setTitikBongkar(datafetch);
            } else {
                setTitikBongkar([]);
            }
        } catch (error) {
            console.log(error);
            setTitikBongkar([]);
        }
    };

    const [po, setPO] = useState(null);

    const [customerOption, setCustomerOption] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [origin, setOrigin] = useState("");
    useEffect(() => {
        if (po) {
            setFormData((prevData) => ({
                ...prevData,
                nomor_po: po.nomor_po || prevData.nomor_po,
                tanggal_po: po.tanggal_po || prevData.tanggal_po,
                jam_pemesanan_po: po.jam_pemesanan_po || prevData.jam_pemesanan_po,
                jam_muat: po.jam_muat || prevData.jam_muat,
                id_customer: po.id_customer || prevData.id_customer,
                id_armada: po.id_armada || prevData.id_armada,
                id_driver: po.id_driver || prevData.id_driver,
                destination: po.destination || prevData.destination,
                status_po: po.status_po || prevData.status_po,
            }));
        }
    }, [po]);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get('http://localhost:3090/api/v1/customer', {
                    headers: {
                        Authorization: token
                    }
                });
                if (response.data.data.length != 0) {
                    const datafetch = response.data.data.map(dataitem => ({
                        value: dataitem.id_customer,
                        label: dataitem.nama_customer,
                        alamat: dataitem.alamat_customer,
                    }));
                    setCustomerOption(datafetch);
                } else {
                    setCustomerOption([]);
                }
            } catch (error) {
                console.log(error);
                setCustomerOption([]);
            }
        };
        fetchCustomer();
    }, [token]);

    useEffect(() => {
        if (customerOption.length > 0 && idCustomerInit) {
            const initialValue = customerOption.find(option => option.value === idCustomerInit) || null;
            setSelectedCustomer(initialValue);
            setOrigin(initialValue.alamat);
        }
    }, [customerOption, idCustomerInit]);

    const handleCustomerChange = async (selectedOption) => {
        setSelectedCustomer(selectedOption);
        setOrigin(selectedOption.alamat);
    };

    const [armadaOption, setArmadaOption] = useState([]);
    const [selectedArmada, setSelectedArmada] = useState(null);
    useEffect(() => {
        const fetchArmada = async () => {
            try {
                const response = await axios.get('http://localhost:3090/api/v1/armadas', {
                    headers: {
                        Authorization: token
                    }
                });
                if (response.data.data.length != 0) {
                    const datafetch = response.data.data.map(dataitem => ({
                        value: dataitem.id_armada,
                        label: dataitem.nopol_armada + ' (' + dataitem.nama_jenis_kendaraan + ')'
                    }));
                    setArmadaOption(datafetch);
                } else {
                    setArmadaOption([]);
                }
            } catch (error) {
                console.log(error);
                setArmadaOption([]);
            }
        };
        fetchArmada();
    }, [token]);
    useEffect(() => {
        if (armadaOption.length > 0 && idArmadaInit) {
            const initialValue = armadaOption.find(option => option.value === idArmadaInit) || null;
            setSelectedArmada(initialValue);
        }
    }, [armadaOption, idArmadaInit]);
    const handleArmadaChange = async (selectedOption) => {
        setSelectedArmada(selectedOption);
    };

    const [driverOption, setDriverOption] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    useEffect(() => {
        const fetchArmada = async () => {
            try {
                const response = await axios.get('http://localhost:3090/api/v1/drivers', {
                    headers: {
                        Authorization: token
                    }
                });
                if (response.data.data.length != 0) {
                    const datafetch = response.data.data.map(dataitem => ({
                        value: dataitem.id_driver,
                        label: dataitem.nama_driver
                    }));
                    setDriverOption(datafetch);
                } else {
                    setDriverOption([]);
                }
            } catch (error) {
                console.log(error);
                setDriverOption([]);
            }
        };
        fetchArmada();
    }, [token]);
    useEffect(() => {
        if (driverOption.length > 0 && idDriverInit) {
            const initialValue = driverOption.find(option => option.value === idDriverInit) || null;
            setSelectedDriver(initialValue);
        }
    }, [driverOption, idDriverInit]);
    const handleDriverChange = async (selectedOption) => {
        setSelectedDriver(selectedOption);
    };

    useEffect(() => {
        const fetchPO = async () => {
            try {
                const response = await axios.get(`http://localhost:3090/api/v1/po/${detailId}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setPO(response.data.data);
            } catch (error) {
                console.log(error);
                setPO([]);
            }
        };
        if (detailId) {
            fetchPO();
            fetchKabupaten();
            fetchTitikBongkar();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailId]);

    // Update formData ketika po berhasil di-fetch
    useEffect(() => {
        if (po) {
            po.kas_jalan = typeof po.kas_jalan === "string" ? JSON.parse(po.kas_jalan) : po.kas_jalan;
            if (po.kas_jalan.REGULER) {
                setFormDataReguler((prevData) => ({
                    id_kas_jalan: po.kas_jalan.REGULER.id_kas_jalan,
                    id_po: po.kas_jalan.REGULER.id_po || prevData.id_po,
                    jarak_isi: po.kas_jalan.REGULER.jarak_isi || prevData.jarak_isi,
                    jarak_kosong: po.kas_jalan.REGULER.jarak_kosong || prevData.jarak_kosong,
                    jam_tunggu: po.kas_jalan.REGULER.jam_tunggu || prevData.jam_tunggu,
                    gaji_driver: po.kas_jalan.REGULER.gaji_driver || prevData.gaji_driver,
                    e_toll: po.kas_jalan.REGULER.e_toll || prevData.e_toll,
                    keterangan_rute: po.kas_jalan.REGULER.keterangan_rute || prevData.keterangan_rute,
                    tonase: po.kas_jalan.REGULER.tonase || prevData.tonase,
                    status_kas_jalan: po.kas_jalan.REGULER.status_kas_jalan || prevData.status_kas_jalan,
                    rasio_perkalian: po.rasio_perkalian || prevData.rasio_perkalian,
                    rasio_perkalian_kosong: po.rasio_perkalian_kosong || prevData.rasio_perkalian_kosong,
                }));
            }
            if (po.kas_jalan.KOSONGAN) {
                setFormDataKosongan((prevData) => ({
                    id_kas_jalan: po.kas_jalan.KOSONGAN.id_kas_jalan,
                    id_po: po.kas_jalan.KOSONGAN.id_po || prevData.id_po,
                    jarak_isi: po.kas_jalan.KOSONGAN.jarak_isi || prevData.jarak_isi,
                    jarak_kosong: po.kas_jalan.KOSONGAN.jarak_kosong || prevData.jarak_kosong,
                    jam_tunggu: po.kas_jalan.KOSONGAN.jam_tunggu || prevData.jam_tunggu,
                    gaji_driver: po.kas_jalan.KOSONGAN.gaji_driver || prevData.gaji_driver,
                    e_toll: po.kas_jalan.KOSONGAN.e_toll || prevData.e_toll,
                    keterangan_rute: po.kas_jalan.KOSONGAN.keterangan_rute || prevData.keterangan_rute,
                    tonase: po.kas_jalan.KOSONGAN.tonase || prevData.tonase,
                    status_kas_jalan: po.kas_jalan.KOSONGAN.status_kas_jalan || prevData.status_kas_jalan,
                    rasio_perkalian: po.rasio_perkalian || prevData.rasio_perkalian,
                    rasio_perkalian_kosong: po.rasio_perkalian_kosong || prevData.rasio_perkalian_kosong,
                }));
            }
        }
    }, [po]);

    // Handle perubahan input form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleChangeReguler = (e) => {
        const { name, value } = e.target;
        setFormDataReguler((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleChangeQuillReguler = (value) => {
        setFormDataReguler((prevData) => ({
            ...prevData,
            keterangan_rute: value,
        }));
    };

    const handleChangeKosongan = (e) => {
        const { name, value } = e.target;
        setFormDataKosongan((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleChangeQuillKosongan = (value) => {
        setFormDataKosongan((prevData) => ({
            ...prevData,
            keterangan_rute: value,
        }));
    };

    const handleUpdateReguler = async (event) => {
        event.preventDefault();
        const dataKasjaRegulertoSubmit = new FormData();
        const dataPOtoSubmit = new FormData();
        dataKasjaRegulertoSubmit.append("id_po", detailId);
        dataKasjaRegulertoSubmit.append("jenis_kas_jalan", "REGULER");
        dataKasjaRegulertoSubmit.append("jarak_isi", formDataReguler.jarak_isi);
        dataKasjaRegulertoSubmit.append("jarak_kosong", formDataReguler.jarak_kosong);
        dataKasjaRegulertoSubmit.append("jam_tunggu", formDataReguler.jam_tunggu);
        dataKasjaRegulertoSubmit.append("gaji_driver", formDataReguler.gaji_driver);
        dataKasjaRegulertoSubmit.append("e_toll", formDataReguler.e_toll);
        dataKasjaRegulertoSubmit.append("keterangan_rute", formDataReguler.keterangan_rute);
        dataKasjaRegulertoSubmit.append("tonase", formDataReguler.tonase);
        dataKasjaRegulertoSubmit.append("status_kas_jalan", "DIBUAT");
        dataPOtoSubmit.append("status_po", "PROSES KEUANGAN");
        try {
            await axios.put(
                `http://localhost:3090/api/v1/kasjalan/${formDataReguler.id_kas_jalan}`,
                dataKasjaRegulertoSubmit,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            await axios.put(
                `http://localhost:3090/api/v1/po/status/${detailId}`,
                dataPOtoSubmit,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            Swal.fire({
                title: "Data Reguler",
                text: "Data Berhasil Diperbaharui",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                handleBackClick();
            });
        } catch (error) {
            console.error("Error submitting data:", error);
            Swal.fire({
                title: "Error",
                text: "Gagal memperbarui data. Silakan coba lagi.",
                icon: "error",
                showConfirmButton: true,
            });
        }
    };

    const handleUpdateKosongan = async (event) => {
        event.preventDefault();
        const dataKasjaKosongantoSubmit = new FormData();
        const dataPOtoSubmit = new FormData();
        dataKasjaKosongantoSubmit.append("id_po", detailId);
        dataKasjaKosongantoSubmit.append("jenis_kas_jalan", "KOSONGAN");
        dataKasjaKosongantoSubmit.append("jarak_isi", formDataKosongan.jarak_isi);
        dataKasjaKosongantoSubmit.append("jarak_kosong", formDataKosongan.jarak_kosong);
        dataKasjaKosongantoSubmit.append("jam_tunggu", formDataKosongan.jam_tunggu);
        dataKasjaKosongantoSubmit.append("gaji_driver", formDataKosongan.gaji_driver);
        dataKasjaKosongantoSubmit.append("e_toll", formDataKosongan.e_toll);
        dataKasjaKosongantoSubmit.append("keterangan_rute", formDataKosongan.keterangan_rute);
        dataKasjaKosongantoSubmit.append("tonase", formDataKosongan.tonase);
        dataKasjaKosongantoSubmit.append("status_kas_jalan", "DIBUAT");
        dataPOtoSubmit.append("status_po", "PROSES KEUANGAN");
        console.log([...dataKasjaKosongantoSubmit.entries()]);
        try {
            await axios.put(
                `http://localhost:3090/api/v1/kasjalan/${formDataKosongan.id_kas_jalan}`,
                dataKasjaKosongantoSubmit,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            await axios.put(
                `http://localhost:3090/api/v1/po/status/${detailId}`,
                dataPOtoSubmit,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            Swal.fire({
                title: "Data Kosongan",
                text: "Data Berhasil Diperbaharui",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                handleBackClick();
            });
        } catch (error) {
            console.error("Error submitting data:", error);
            Swal.fire({
                title: "Error",
                text: "Gagal memperbarui data. Silakan coba lagi.",
                icon: "error",
                showConfirmButton: true,
            });
        }
    };

    const handleUpdateTitikBongkar = async (event) => {
        event.preventDefault();
        const dataTitikBongkartoSubmit = new FormData();
        dataTitikBongkartoSubmit.append("id_po", detailId);
        dataTitikBongkartoSubmit.append("id_kabupaten_kota", selectedTitikBongkar?.value || "");
        dataTitikBongkartoSubmit.append("alamat_titik_bongkar", formDataTitikBongkar.alamat_titik_bongkar || "");
        dataTitikBongkartoSubmit.append("jam_bongkar", ""); 
        dataTitikBongkartoSubmit.append("shareloc", formDataTitikBongkar.shareloc || "");
        dataTitikBongkartoSubmit.append("nama_penerima", formDataTitikBongkar.nama_penerima || "");
        dataTitikBongkartoSubmit.append("nomor_penerima", formDataTitikBongkar.nomor_penerima || "");
        console.log([...dataTitikBongkartoSubmit.entries()]);

        try {
            await axios.post(
                `http://localhost:3090/api/v1/titikbongkar`,
                dataTitikBongkartoSubmit,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            Swal.fire({
                title: "Data Titik Bongkar",
                text: "Data Berhasil Diperbaharui",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                fetchTitikBongkar();
            });
        } catch (error) {
            console.error("Error submitting data:", error);
            Swal.fire({
                title: "Error",
                text: "Gagal memperbarui data. Silakan coba lagi.",
                icon: "error",
                showConfirmButton: true,
            });
        }
    };
    const handleDelete = async (id_titik_bongkar) => {
        try {
            await axios.delete(`http://localhost:3090/api/v1/titikbongkar/${id_titik_bongkar}`, {
                headers: { Authorization: token },
            });
            Swal.fire("Deleted!", "Data berhasil dihapus.", "success")
                .then(() => fetchTitikBongkar()); // 🔄 Reload data setelah delete
        } catch (error) {
            console.error("Error deleting data:", error);
            Swal.fire("Error!", "Gagal menghapus data.", "error");
        }
    };
    




    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }


    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Detail PO & Kas Jalan</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik{" "}
                    <button
                        className="fw-bold btn btn-link p-0"
                        onClick={() => handleBackClick()}
                    >
                        disini
                    </button>{" "}
                    untuk kembali ke menu utama Kas Jalan.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi PO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nomor_po" className="form-label">Nomor PO</label>
                        <input className="form-control" type="text" id="nomor_po" name='nomor_po' placeholder="88LOG-PO0000-000" onChange={handleChange} required readOnly value={formData.nomor_po || ""} />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="tanggal_po" className="form-label">Tanggal PO</label>
                        <input className="form-control text-uppercase" type="date" id="tanggal_po" name='tanggal_po' placeholder="" onChange={handleChange}
                            value={formData.tanggal_po || ""}
                            required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jam_pemesanan_po" className="form-label">Jam Stanby</label>
                        <input className="form-control" type="time" id="jam_pemesanan_po" name='jam_pemesanan_po' onChange={handleChange} value={formData.jam_pemesanan_po || ""}
                            required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jam_muat" className="form-label">Jam Muat</label>
                        <input className="form-control" type="time" id="jam_muat" name='jam_muat' onChange={handleChange} value={formData.jam_muat || ""} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_customer" className="form-label">Customer</label>
                        <Select
                            id="id_customer"
                            name="id_customer"
                            value={selectedCustomer}
                            onChange={handleCustomerChange}
                            options={customerOption}
                            placeholder="Pilih Customer"
                            required isDisabled
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="telpon_kontak_darurat_driver" className="form-label">Origin</label>
                        <input className="form-control text-uppercase" type="text" readOnly value={origin} />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="destination" className="form-label">Destination</label>
                        <input className="form-control" type="text" id="destination" name='destination' placeholder="" onChange={handleChange} value={formData.destination || ""} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3 d-none">
                        <label htmlFor="id_armada" className="form-label">Armada</label>
                        <Select
                            id="id_armada"
                            name="id_armada"
                            value={selectedArmada}
                            onChange={handleArmadaChange}
                            options={armadaOption}
                            placeholder="Pilih Armada"
                            required isDisabled
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3 d-none">
                        <label htmlFor="id_driver" className="form-label">Driver</label>
                        <Select
                            id="id_driver"
                            name="id_driver"
                            value={selectedDriver}
                            onChange={handleDriverChange}
                            options={driverOption}
                            placeholder="Pilih Driver"
                            required isDisabled
                        />
                    </div>
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Kas Jalan Reguler</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {formDataReguler && (
                    <div className='row' >
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jarak_isi" className="form-label">Jarak Isi (KM)</label>
                            <input
                                className="form-control"
                                type="text"  // Ubah ke text agar bisa menampilkan format ribuan
                                id="jarak_isi"
                                name="jarak_isi"
                                placeholder="Masukkan jarak isi"
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya ambil angka
                                    setFormDataReguler((prevData) => ({
                                        ...prevData,
                                        jarak_isi: rawValue ? parseInt(rawValue, 10) : "" // Pastikan tetap angka
                                    }));
                                }}
                                value={formDataReguler.jarak_isi ? formDataReguler.jarak_isi.toLocaleString('id-ID') : ""}
                                required
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="solar_isi" className="form-label">Solar Isi</label>
                            <input className="form-control" type="text" id="solar_isi" name="solar_isi" placeholder="Rp.0,00" onChange={handleChangeReguler} required readOnly value={formatRupiah(formDataReguler.jarak_isi * ((parseFloat(formDataReguler.rasio_perkalian)) + (70 * parseFloat(formDataReguler.tonase) / 1000)))} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jarak_kosong" className="form-label">Jarak Kosong (KM)</label>
                            <input
                                className="form-control"
                                type="text"  // Ubah ke text agar bisa menampilkan format ribuan
                                id="jarak_kosong"
                                name="jarak_kosong"
                                placeholder="0"
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya ambil angka
                                    setFormDataReguler((prevData) => ({
                                        ...prevData,
                                        jarak_kosong: rawValue ? parseInt(rawValue, 10) : "" // Pastikan tetap angka
                                    }));
                                }}
                                value={formDataReguler.jarak_kosong ? formDataReguler.jarak_kosong.toLocaleString('id-ID') : ""}
                                required
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="solar_kosong" className="form-label">Solar Kosong</label>
                            <input className="form-control" type="text" id="solar_kosong" name="solar_kosong" placeholder="Rp.0,00" onChange={handleChangeReguler} required readOnly value={formatRupiah(parseFloat(formDataReguler.jarak_kosong) * (parseFloat(formDataReguler.rasio_perkalian_kosong)))} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jam_tunggu" className="form-label">Jam Tunggu (Jam)</label>
                            <input className="form-control" type="number" id="jam_tunggu" name="jam_tunggu" placeholder="0" onChange={handleChangeReguler} required value={formDataReguler.jam_tunggu} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="solar_tunggu" className="form-label">Solar Tunggu</label>
                            <input className="form-control" type="text" id="solar_tunggu" name="solar_tunggu" placeholder="Rp.0,00" onChange={handleChangeReguler} required readOnly value={formatRupiah(parseInt(formDataReguler.jam_tunggu) * 11000)} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="gaji_driver" className="form-label">Gaji Driver</label>
                            <input className="form-control" type="number" id="gaji_driver" name="gaji_driver" placeholder="0" onChange={handleChangeReguler} required value={formDataReguler.gaji_driver} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="e_toll" className="form-label">E-Toll</label>
                            <input className="form-control" type="type" id="e_toll" name="e_toll" placeholder="0" onChange={handleChangeReguler} required value={formDataReguler.e_toll} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tonase" className="form-label">Tonase (Kg)</label>
                            <input className="form-control" type="text" id="tonase" name="tonase" placeholder="0" onChange={handleChangeReguler} required value={(formDataReguler.tonase ? parseInt(formDataReguler.tonase) : 0).toLocaleString('id-ID')} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="kas_jalan" className="form-label">Kas Jalan</label>
                            <input className="form-control" type="text" id="kas_jalan" name="kas_jalan" placeholder="0" onChange={handleChangeReguler} required readOnly value={formatRupiah((parseInt(formDataReguler.jam_tunggu) * 11000) + (formDataReguler.jarak_isi * ((parseFloat(formDataReguler.rasio_perkalian)) + (70 * parseFloat(formDataReguler.tonase) / 1000))) + (parseFloat(formDataReguler.jarak_kosong) * (parseFloat(formDataReguler.rasio_perkalian_kosong))) + (parseFloat(formDataReguler.gaji_driver)) + (parseFloat(formDataReguler.e_toll)))} />
                        </div>
                        <div className="col-md-12 col-sm-12 mb-3">
                            <label htmlFor="keterangan_rute" className="form-label">Keterangan Rute</label>
                            <ReactQuill
                                theme="snow"
                                value={formDataReguler.keterangan_rute}
                                onChange={handleChangeQuillReguler}
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">
                                Proses
                            </label>
                            <button
                                type="button"
                                onClick={handleUpdateReguler}
                                className="btn btn-primary w-100"
                            >
                                SIMPAN PERUBAHAN
                            </button>
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Kas Jalan Kosongan (To Garasi)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {formDataKosongan && (
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jarak_isi" className="form-label">Jarak Isi (KM)</label>
                            <input
                                className="form-control"
                                type="text"  // Ubah type jadi text agar bisa tampilkan angka berformat
                                id="jarak_isi"
                                name="jarak_isi"
                                placeholder="Masukkan jarak isi"
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya ambil angka
                                    setFormDataKosongan((prevData) => ({
                                        ...prevData,
                                        jarak_isi: rawValue ? parseInt(rawValue, 10) : "" // Pastikan tetap angka
                                    }));
                                }}
                                required
                                value={formDataKosongan.jarak_isi ? formDataKosongan.jarak_isi.toLocaleString('id-ID') : "0"}
                            />
                        </div>

                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="solar_isi" className="form-label">Solar Isi</label>
                            <input className="form-control" type="text" id="solar_isi" name="solar_isi" placeholder="Rp.0,00" onChange={handleChangeKosongan} required readOnly value={formatRupiah(formDataKosongan.jarak_isi * ((parseFloat(formDataKosongan.rasio_perkalian)) + (70 * parseFloat(formDataKosongan.tonase) / 1000)))} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jarak_kosong" className="form-label">Jarak Kosong (KM)</label>
                            <input
                                className="form-control"
                                type="text"  // Ubah ke text agar bisa menampilkan format ribuan
                                id="jarak_kosong"
                                name="jarak_kosong"
                                placeholder="0"
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
                                    setFormDataKosongan((prevData) => ({
                                        ...prevData,
                                        jarak_kosong: rawValue ? parseInt(rawValue, 10) : "" // Pastikan tetap angka
                                    }));
                                }}
                                value={formDataKosongan.jarak_kosong ? formDataKosongan.jarak_kosong.toLocaleString('id-ID') : "0"}
                                required
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="solar_kosong" className="form-label">Solar Kosong</label>
                            <input className="form-control" type="text" id="solar_kosong" name="solar_kosong" placeholder="Rp.0,00" onChange={handleChangeKosongan} required readOnly value={formatRupiah(parseFloat(formDataKosongan.jarak_kosong) * (parseFloat(formDataKosongan.rasio_perkalian_kosong)))} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jam_tunggu" className="form-label">Jam Tunggu (Jam)</label>
                            <input className="form-control" type="number" id="jam_tunggu" name="jam_tunggu" placeholder="0" onChange={handleChangeKosongan} required value={formDataKosongan.jam_tunggu} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="solar_tunggu" className="form-label">Solar Tunggu</label>
                            <input className="form-control" type="text" id="solar_tunggu" name="solar_tunggu" placeholder="Rp.0,00" onChange={handleChangeKosongan} required readOnly value={formatRupiah(parseInt(formDataKosongan.jam_tunggu) * 11000)} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="gaji_driver" className="form-label">Gaji Driver</label>
                            <input className="form-control" type="text" id="gaji_driver" name="gaji_driver" placeholder="0" onChange={handleChangeKosongan} required value={formDataKosongan.gaji_driver} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="e_toll" className="form-label">E-Toll</label>
                            <input className="form-control" type="text" id="e_toll" name="e_toll" placeholder="0" onChange={handleChangeKosongan} required value={formDataKosongan.e_toll} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jarak_kosong" className="form-label">Tonase (KG)</label>
                            <input
                                className="form-control"
                                type="text"  // Ubah ke text agar bisa menampilkan format ribuan
                                id="tonase"
                                name="tonase"
                                placeholder="0"
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
                                    setFormDataKosongan((prevData) => ({
                                        ...prevData,
                                        tonase: rawValue ? parseInt(rawValue, 10) : "" // Pastikan tetap angka
                                    }));
                                }}
                                value={formDataKosongan.tonase ? formDataKosongan.tonase.toLocaleString('id-ID') : "0"}
                                required
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="kas_jalan" className="form-label">Kas Jalan</label>
                            <input className="form-control" type="text" id="kas_jalan" name="kas_jalan" placeholder="0" onChange={handleChangeKosongan} required readOnly value={formatRupiah((parseInt(formDataKosongan.jam_tunggu) * 11000) + (formDataKosongan.jarak_isi * ((parseFloat(formDataKosongan.rasio_perkalian)) + (70 * parseFloat(formDataKosongan.tonase) / 1000))) + (parseFloat(formDataKosongan.jarak_kosong) * (parseFloat(formDataKosongan.rasio_perkalian_kosong))) + (parseFloat(formDataKosongan.gaji_driver)) + (parseFloat(formDataKosongan.e_toll)))} />
                        </div>
                        <div className="col-md-12 col-sm-12 mb-3">
                            <label htmlFor="keterangan_rute" className="form-label">Keterangan Rute</label>
                            <ReactQuill
                                theme="snow"
                                value={formDataKosongan.keterangan_rute}
                                onChange={handleChangeQuillKosongan}
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">
                                Proses
                            </label>
                            <button
                                type="button"
                                onClick={handleUpdateKosongan}
                                className="btn btn-primary w-100"
                            >
                                SIMPAN PERUBAHAN
                            </button>
                        </div>
                    </div>
                )}
                <div className='row' >
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Titik Bongkar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {formDataTitikBongkar && (
                    <div className='row' >
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_kabupaten_kota" className="form-label">Titik Bongkar</label>
                            <Select
                                id="id_kabupaten_kota"
                                name="id_kabupaten_kota"
                                value={selectedTitikBongkar}
                                onChange={handleTitikBongkarChange}
                                options={titikBongkarOption}
                                placeholder="Pilih Titik Bongkar"
                                required
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="alamat_titik_bongkar" className="form-label">Alamat Titik Bongkar</label>
                            <input className="form-control text-uppercase" type="text" id="alamat_titik_bongkar" name="alamat_titik_bongkar" placeholder="Alamat Titik Bongkar" required value={formDataTitikBongkar.alamat_titik_bongkar} onChange={(e) => setFormDataTitikBongkar({ ...formDataTitikBongkar, alamat_titik_bongkar: e.target.value })} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="shareloc" className="form-label">Shareloc</label>
                            <input className="form-control" type="text" id="shareloc" name="shareloc" placeholder="Shareloc" required value={formDataTitikBongkar.shareloc} onChange={(e) => setFormDataTitikBongkar({ ...formDataTitikBongkar, shareloc: e.target.value })} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_penerima" className="form-label">Nama Penerima</label>
                            <input className="form-control text-uppercase" type="text" id="nama_penerima" name="nama_penerima" placeholder="Nama Penerima" required value={formDataTitikBongkar.nama_penerima} onChange={(e) => setFormDataTitikBongkar({ ...formDataTitikBongkar, nama_penerima: e.target.value })} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nomor_penerima" className="form-label">Nomor Penerima</label>
                            <input className="form-control text-uppercase" type="text" id="nomor_penerima" name="nomor_penerima" placeholder="Nomor Penerima" required value={formDataTitikBongkar.nomor_penerima} onChange={(e) => setFormDataTitikBongkar({ ...formDataTitikBongkar, nomor_penerima: e.target.value })} />
                        </div>
                    </div>
                )}
                <div className="col-md-3 col-sm-12 mb-3">
                    <label htmlFor="" className="form-label">
                        Proses
                    </label>
                    <button
                        type="button"
                        onClick={handleUpdateTitikBongkar}
                        className="btn btn-primary w-100"
                    >
                        SIMPAN PERUBAHAN
                    </button>
                </div>
                <div className="col-lg-12">
                    <div className="mb-3">
                        <div className="divider text-start">
                            <div className="divider-text">
                                <span className="menu-header-text fs-6">Titik Bongkar</span>
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
                                    <th className='fw-bold'>Titik Bongkar</th>
                                    <th className='fw-bold'>Alamat Titik Bongkar</th>
                                    <th className='fw-bold'>Shareloc</th>
                                    <th className='fw-bold'>Nama Penerima</th>
                                    <th className='fw-bold'>Nomor Penerima</th>
                                </tr>
                            </thead>
                            <tbody>
                                {titikBongkar.length > 0 ? (
                                    titikBongkar.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.nama_kabupaten_kota}</td>
                                            <td>{item.alamat_titik_bongkar}</td>
                                            <td>{item.shareloc}</td>
                                            <td>{item.nama_penerima}</td>
                                            <td>{item.nomor_penerima}</td>
                                            <td className="text-center">
                                                <button onClick={() => handleDelete(item.id_titik_bongkar)} className="border-0 bg-transparent text-danger">
                                                    <i className="bx bx-zoom-in text-priamry"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">Data tidak tersedia</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

DetailPage.propTypes = {
    detailId: PropTypes.number.isRequired,
    idCustomerInit: PropTypes.number.isRequired,
    idArmadaInit: PropTypes.number.isRequired,
    idDriverInit: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired
};

export default DetailPage;