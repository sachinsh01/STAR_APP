// Import necessary libraries 
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

function ManagersChart() {
  
  //Set the baseURL
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

  const [options, setOptions] = useState({
    // render loading... text
    noData: {
      text: "Loading...",
      align: "center",
      verticalAlign: "middle",
      offsetY: 0,
      offsetX: 0,
      style: {
        color: "green",
        fontSize: "16px",
      },
    },
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: ["#3c7bcf","#0cad9b"],
    // styling x-axis labels
    xaxis: {
      title: {
        text: "Hours",
        style: {
          fontSize: "20px",
          fontWeight: 500,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
      },
    },
    // styling y-axis labels
    yaxis: {
      title: {
        text: "Managers",
        style: {
          fontSize: "20px",
          fontWeight: 500,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
      },
      categories: [], // Initialize with an empty array
    },
  });

  const [data, setData] = useState([
    {
      name: "Actual Hours",
      data: [],
    },
    {
      name: "Expected Hours",
      data: [],
    },
  ]);

  // render data from api
  useEffect(() => {
    axios
      .get(baseURL + "/analytics/getDataOfManagers") 
      .then((response) => {
        const managersData = response.data.managersData;

        const managerNames = [];
        const expectedHours = [];
        const actualHours = [];

        for (const key in managersData) {
          const data = managersData[key];
          managerNames.push(data.manager);
          actualHours.push(data.hours);
          expectedHours.push(data.expectedHours);
        }

        setOptions((prevOptions) => ({
          ...prevOptions,
          yaxis: {
            ...prevOptions.yaxis,
          },
          xaxis: {
            categories: managerNames,
          },
        }));

        setData([
          {
            name: "Actual Hours",
            data: actualHours,
          },
          {
            name: "Expected Hours",
            data: expectedHours,
          },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="horizontal-bar-chart">
    {/* display the chart */}
      <ReactApexChart
        options={options}
        series={data}
        type="bar"
        height={350}
        width={510}
      />
    </div>
  );
}

export default ManagersChart;
