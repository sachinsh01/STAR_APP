// Import necessary libraries 
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";

function ProjectChart() {
  
  //Set the baseURL
  const baseURL = process.env.NODE_ENV === 'production' ? 'https://3.108.23.98/API' : 'http://localhost:4000';

  const [data, setData] = useState([]);
  const [options, setOptions] = useState({
    // style the chart labels and titles
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
      id: "project-chart",
    },
    xaxis: {
      labels: {
        rotate: 0,
      },
      categories: [],
      title: {
        text: "Projects",
        style: {
          fontSize: "20px",
          fontWeight: 500,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
      },
    },
    yaxis: {
      title: {
        text: "Hours",
        style: {
          fontSize: "20px",
          fontWeight: 500,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
      },
      labels: {
        formatter: (val) => {
          if (val < 1000) return val;
          return val / 1000 + "K";
        },
      },
    },
    colors: ["#3c7bcf", "#0cad9b"],
  });

  useEffect(() => {
    // Make an Axios call to get project data
    axios
      .get(baseURL + "/analytics/getDataOfProjects") 
      .then((response) => {
        const projectArray = response.data.projectArray;
        const projectNames = [];
        const projectHours = [];
        const expectedHours = [];

        for (const key in projectArray) {
          const project = projectArray[key];
          if (project.projectName.toLowerCase().includes("holiday")) {
          } else {
            projectNames.push(project.projectName.split(" "));
            projectHours.push(project.hours);
            expectedHours.push(project.expectedHours);
          }
        }

        setData([
          { name: "Actual Hours", data: projectHours },
          { name: "Expected Hours", data: expectedHours },
        ]);
        setOptions({
          ...options,
          xaxis: { categories: projectNames },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="project-chart">
      <ReactApexChart
        options={options}
        series={data}
        type="bar"
        height={350}
        width={820}
      />
    </div>
  );
}

export default ProjectChart;
