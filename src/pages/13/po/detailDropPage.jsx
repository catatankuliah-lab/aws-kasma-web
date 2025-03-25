import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import Swal from "sweetalert2";

const DetailDropPage = ({ detailId, handleBackClick }) => {
    const token = localStorage.getItem("token");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // State untuk formData
    const [formData, setFormData] = useState({
        id_po: "",
        id_kabupaten_kota: "",
        nomor_po: "",
        tanggal_po: "",
        alamat_titik_bongkar: "",
        jam_bongkar: "",
        shareloc: "",
        nama_penerima: "",
        nomor_penerima: "",
        foto_bongkar: ""
    });

    // Fetch data dari API saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchTitikBongkar = async () => {
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:3090/api/v1/titikbongkar/${detailId}`,
                    {
                        headers: { Authorization: token }
                    }
                );
                if (response.data.data) {
                    const data = response.data.data;
                    setFormData({
                        id_po: data.id_po || "",
                        id_kabupaten_kota: data.id_kabupaten_kota || "",
                        nomor_po: data.nomor_po || "",
                        tanggal_po: data.tanggal_po || "",
                        alamat_titik_bongkar: data.alamat_titik_bongkar || "",
                        jam_bongkar: data.jam_bongkar || "",
                        shareloc: data.shareloc || "",
                        nama_penerima: data.nama_penerima || "",
                        nomor_penerima: data.nomor_penerima || "",
                        foto_bongkar: data.foto_bongkar || ""
                    });
                } else {
                    Swal.fire("Gagal!", "Data tidak ditemukan!", "error");
                }
            } catch (error) {
                console.error("Error fetching titik bongkar:", error);
                Swal.fire("Error!", "Gagal mengambil data.", "error");
            }
        };

        fetchTitikBongkar();
    }, [detailId, token]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            Swal.fire({
                title: "Error",
                text: "Gagal upload data, pilih file terlebih dahulu",
                icon: "error",
                showConfirmButton: false,
            });
            return;
        }

        if (!formData.nomor_po) {
            Swal.fire({
                title: "Error",
                text: "Nomor PO tidak tersedia! Coba refresh halaman.",
                icon: "error",
                showConfirmButton: false,
            });
            return;
        }

        const uploadData = new FormData();
        uploadData.append("file_titik_bongkar", selectedFile);
        uploadData.append("nomor_po", formData.nomor_po);
        uploadData.append("tanggal_po", formData.tanggal_po);

        console.log("Data yang dikirim:", Object.fromEntries(uploadData.entries())); // Debugging

        try {
            const response = await fetch(`http://localhost:3090/api/v1/titikbongkar/upload/${detailId}`, {
                method: "PUT",
                body: uploadData,
                headers: {
                    Authorization: token,
                },
            });

            if (!response.ok) {
                throw new Error("Gagal upload data");
            }

            Swal.fire({
                title: "Data Loading Order",
                text: "Data Berhasil Diupload",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
            });
        } catch (error) {
            console.error("Error upload file:", error);
            Swal.fire({
                title: "Error",
                text: "Gagal upload data. Silakan coba lagi.",
                icon: "error",
                showConfirmButton: false,
            });
        }
    };


    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Detail Titik Bongkar</span>
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
                    untuk kembali ke menu utama Purchase Order.
                </div>
            </div>
            <div className="col-lg-12">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Titik Bongkar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="alamat_titik_bongkar" className="form-label">
                            Alamat Titik Bongkar
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="alamat_titik_bongkar"
                            name="alamat_titik_bongkar"
                            readOnly
                            value={formData.alamat_titik_bongkar}
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="shareloc" className="form-label">Shareloc</label>
                        <input
                            className="form-control"
                            type="text"
                            id="shareloc"
                            name="shareloc"
                            readOnly
                            value={formData.shareloc}
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_penerima" className="form-label">Nama Penerima</label>
                        <input
                            className="form-control"
                            type="text"
                            id="nama_penerima"
                            name="nama_penerima"
                            readOnly
                            value={formData.nama_penerima}
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nomor_penerima" className="form-label">Nomor Penerima</label>
                        <input
                            className="form-control"
                            type="text"
                            id="nomor_penerima"
                            name="nomor_penerima"
                            readOnly
                            value={formData.nomor_penerima}
                        />
                    </div>
                    <div className="col-lg-12 mt-2">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">
                                        Uplaod Foto Titik Bongkar
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 col-sm-12 mb-4">
                        <label htmlFor="file_titik_bongkar" className="form-label">Upload Foto</label>
                        <input
                            className="form-control"
                            type="file"
                            id="file_titik_bongkar"
                            name="file_titik_bongkar"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="" className="form-label">Proses</label>
                        <button
                            type="button"
                            onClick={handleFileUpload}
                            className="btn btn-primary w-100"
                        >
                            UPLOAD
                        </button>
                    </div>
                    <div className="col-md-12 col-sm-12 mb-3">
                        {formData.foto_bongkar && formData.foto_bongkar !== "" ? (
                            <iframe
                                key={formData.foto_bongkar}
                                src={`http://localhost:3090/${formData.foto_bongkar}?t=${new Date().getTime()}`}
                                width="100%"
                                height="620px"
                                style={{ border: "none" }}
                            />
                        ) : (
                            <p>Loading atau File Tidak Ada...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
DetailDropPage.propTypes = {
    detailId: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired
};
export default DetailDropPage;
