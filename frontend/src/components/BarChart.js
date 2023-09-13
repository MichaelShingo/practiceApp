import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { useContext } from 'react';

import { Bar } from 'react-chartjs-2';
import { ThemeContext } from '../App';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ title, labels, data }) => {
  const theme = useContext(ThemeContext);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Pieces Completed',
        data: data,
        backgroundColor: '#046cf3',
      },
    ],
  };

  const labelColor = theme === 'light' ? 'black' : 'white';

  const options = {
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: labelColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: labelColor,
        },
      },
      y: {
        ticks: {
          color: labelColor,
        },
      },
    },
  };

  return (
    <div className="chart-column">
      <h1>{title}</h1>
      <div className="chart-container" id="bar-chart">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
