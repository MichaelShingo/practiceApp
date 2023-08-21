import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, CategoryScale} from 'chart.js';
import 'chart.js/auto';
import ToggleSwitch from './ToggleSwitch';
import { useContext, useState } from 'react';
import { ThemeContext } from '../App';
Chart.register(ArcElement);
Chart.register(Tooltip);
Chart.register(CategoryScale);

const DoughnutChart = ( {labels, colors, data, title} ) => {
    const [showLegend, setShowLegend] = useState(false);
    const [theme] = useContext(ThemeContext);

    const options = {
        maintainAspectRatio: true,
        elements: {
            arc: {
                borderWidth: 2,
            }
        },
        plugins: {
            legend: {
                display: showLegend,
                labels: {
                    color: theme === 'light' ? 'black' : 'white'
                }
            },
        },
    }
    return ( 
        <div className="chart-column">
            <h1>{title}</h1>
            
            <div className="chart-container">
                <Doughnut 
                data={{
                    labels: labels,
                    datasets: [{
                    label: 'Completed Pieces',
                    data: data,
                    backgroundColor: colors,
                    }]
                }}
                options={options}
                />
            </div>
            <ToggleSwitch 
                scale={'scale(85%)'}
                isChecked={showLegend}
                setIsChecked={setShowLegend}
            />
        </div>
     );
}
 
export default DoughnutChart;