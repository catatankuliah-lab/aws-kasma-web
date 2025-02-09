import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const DriverAvailabilityChart = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [tersedia, setTersedia] = useState(0);
    const [tidaktersedia, setTidakTersedia] = useState(0);

    useEffect(() => {
        if (!token) navigate("/");
    }, [navigate, token]);

    useEffect(() => {
        const fetchDriverAvailability = async () => {
            if (!token) {
                console.error("No token provided");
                return;
            }
        
            try {
                const response = await axios.get("http://localhost:3090/api/v1/driver/availability", {
                    headers: { Authorization: token },
                });
                console.log(response.data.data.available[0].available);
                setTersedia(response.data.data.available[0].available);
                setTidakTersedia(response.data.data.unavailable[0].unavailable);
            } catch (error) {
                console.error("Error fetching driver availability:", error.response?.status, error.response?.data);
            }
        };
        
        fetchDriverAvailability();
    }, [token]);

    const data = {
        labels: ["Tersedia", "Tidak Tersedia"],
        datasets: [
            {
                label: "Driver Availability",
                data: [tersedia,tidaktersedia],
                backgroundColor: ["#4CAF50", "#FF7043"],
                borderColor: ["#ffffff"],
                borderWidth: 2,
            },
        ],
    };

    // Opsi Pie Chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
            <h2>AKTIF & TIDAK AKTIF DRIVER</h2>
            <Pie data={data} options={options} />
        </div>
    );
    
};

export default DriverAvailabilityChart;
