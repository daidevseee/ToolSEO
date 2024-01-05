import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TrafficBarChart = ({ trafficData }) => {
  const labels = trafficData.map(data => new Date(data.startDate).toLocaleDateString());

  const dataset = {
    labels,
    datasets: [
      {
        label: 'Traffic Hôm nay',
        data: trafficData.map(data => data.trafficToday),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  return <Bar data={dataset} />;
};

export default TrafficBarChart;
