import { useEffect, useState } from 'react';
import { mapColorRange } from '../services/helperFunctions.js';
import { Doughnut, Line } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, CategoryScale} from 'chart.js';
import 'chart.js/auto';
Chart.register(ArcElement);
Chart.register(Tooltip)
Chart.register(CategoryScale);


const PeriodChart = ( {periods, userPieces} ) => {
    let labels = periods.map(period => period.name);
    let [data, setData] = useState([]);
    let [colors, setColors] = useState([]);
    let map = new Map();
    let masteryMap = new Map();
    for (let period of periods) {
        map.set(period.name, 0);
        masteryMap.set(period.name, 0);
    }
    useEffect(() => {
        // console.log(`USER PIECE TEfST : ${userPieces[0].piece.period.name}`);
        for (let entry of userPieces) {
            map.set(entry.piece.period.name, parseInt(map.get(entry.piece.period.name)) + 1);
            masteryMap.set(entry.piece.period.name, masteryMap.get(entry.piece.period.name) + entry.mastery_level);
        }

        for (let label of labels) {
            console.log(`${ masteryMap.get(label) / map.get(label)}`)
            masteryMap.set(label, masteryMap.get(label) / map.get(label));
        }
        console.log(`masterymap = ${[...masteryMap.entries()]}`);
        console.log(`romantic = ${masteryMap.get('Romantic')}`)
        setColors(Array.from(masteryMap.values()));
        setData(Array.from(map.values()));
    }, [periods, userPieces])
    
    let hsl = [`hsl(, 100%, 38%)`,
    `hsl(${colors[1]}, 100%, 38%)`,
    `hsl(${colors[2]}, 100%, 38%)`,
    `hsl(${colors[3]}, 100%, 38%)`,
    `hsl(${colors[4]}, 100%, 38%)`]
    let rgb = ['#003f5c',
    '#58508d',
     '#bc5090',
     '#ff6361',
     '#ffa600']

    return ( 
        <div className="chart-container">
            
            <Doughnut 
            data={{
                labels: labels,
             
                datasets: [{
                  label: 'Completed Pieces',
                  data: data,
                  backgroundColor: rgb,
                }]
              }}
            options={{
                plugins: {
                    legend: {
                        display: false,
                    },
                },

            }}
        
            />
        </div>
        
     );
}
 


export default PeriodChart;