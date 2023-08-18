import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, CategoryScale} from 'chart.js';
import 'chart.js/auto';
import ToggleSwitch from './ToggleSwitch';
import { useState } from 'react';
Chart.register(ArcElement);
Chart.register(Tooltip);
Chart.register(CategoryScale);

const DoughnutChart = ( {labels, colors, data, title} ) => {
    const [showLegend, setShowLegend] = useState(false);

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
                options={{
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: showLegend,
                        },
                    },
                }}
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