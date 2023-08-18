import { Chart as ChartJS, 
    BarElement, 
    CategoryScale, 
    LinearScale,
    Tooltip,
    Legend } from 'chart.js';

import { Bar } from 'react-chartjs-2';
ChartJS.register(
    BarElement, 
    CategoryScale, 
    LinearScale,
    Tooltip,
    Legend
)

const BarChart = ( {title, labels, data} ) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Number of Pieces Completed',
                data: data,
                backgroundColor: '#046cf3',
            }
        ]
    }

    const options = {
        maintainAspectRatio: true,

    };
    
    return ( 
        <div className="chart-column">
            <h1>{title}</h1>
            <div className="chart-container" id="bar-chart">
                <Bar 
                    data={chartData}
                    options={options}
                />
            </div>
        </div>
     );
}
 
export default BarChart;