// Import necessary libraries 
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useCookies } from 'react-cookie';

export default function VerticalWorkTime() {

    const [cookies] = useCookies(['token']);
    const [data, setData] = useState({});

    //Set the baseURL
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

    useEffect(() => {
        axios({
            method: "get",
            url: baseURL + "/analytics/vertical-time",
            headers: {
                'Authorization': `Bearer ${cookies.token}`,
            }
        }).then((response) => {
            setData({
                labels: response.data.labels,
                datasets: [
                    {
                        label: 'Overtime',
                        data: response.data.greaterThanExpected,
                        backgroundColor: 'rgb(12, 173, 155)',
                        borderColor: 'rgba(12, 173, 155)', // Add the borderColor property here
                        borderWidth: 1, // You can specify the width of the border if needed
                    },
                    {
                        label: 'Undertime',
                        data: response.data.smallerThanExpected,
                        backgroundColor: 'rgb(60, 123, 207, 1)',
                        borderColor: 'rgb(60, 123, 207, 1)', // Add the borderColor property here
                        borderWidth: 1, // You can specify the width of the border if needed
                    },
                ],
            })
        })
    }, [])

    const options = {
        indexAxis: 'y', // or 'x'
        /* plugins: {
            title: {
                display: true,
                text: 'Stacked Bar Chart Example',
            },
        }, */
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    if (Object.keys(data).length === 0) {
        return <div>Loading...</div>; // Add a loading indicator until the data is fetched
    }

    return (
        <Bar data={data} options={options}/>
    );
};
