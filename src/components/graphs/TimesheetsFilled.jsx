// Import necessary libraries 
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useCookies } from 'react-cookie';

export default function TimesheetsFilled() {

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    const [cookies] = useCookies(['token']);
    const [data, setData] = useState({})

    useEffect(() => {
        axios({
            method: "get",
            url: baseURL + "/analytics/timesheets-filled",
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        }).then((response) => {

            setData({
                labels: ["% Timesheets Filled"], // Labels for the x-axis
                datasets: [
                    {
                        label: "Filled On-Time",
                        data: [response.data.data[0]],
                        backgroundColor: 'rgb(12, 173, 155)', // Customize the color as needed
                        borderWidth: 1,
                    },
                    {
                        label: "Not Filled On-Time",
                        data: [response.data.data[1]],
                        backgroundColor: 'rgba(60, 123, 207, 1)', // Customize the color as needed
                        borderColor: 'rgba(60, 123, 207, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        })
    }, []);

    if (Object.keys(data).length === 0) {
        return <div>Loading...</div>; // Add a loading indicator until the data is fetched
    }

    return (
        <Bar data={data} />
    );
};
