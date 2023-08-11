import { useEffect, useState } from 'react';
import { mapColorRange } from '../services/helperFunctions.js';
import { host } from '../services/urls';

import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, CategoryScale} from 'chart.js';
import 'chart.js/auto';
Chart.register(ArcElement);
Chart.register(Tooltip);
Chart.register(CategoryScale);




const TypeChart = ( { userPieces} ) => {
    // let labels = periods.map(period => period.name);
    const [types, setTypes] = useState([]);
    let [data, setData] = useState([1, 2, 3, 4, 5]);
    let [colors, setColors] = useState([]);
    let map = new Map();
    let masteryMap = new Map();
    

    useEffect(() => {
        fetchTypes();
        
    }, [])
    useEffect(() => {
        // console.log(`USER PIECE TEfST : ${userPieces[0].piece.period.name}`);
        for (let type of types) {
            map.set(type, 0);
            console.log(`types = ${type}`)
            // masteryMap.set(type.name, 0);
        }
        console.log(map);
        for (let entry of userPieces) {
            map.set(entry.piece.type_of_piece.name, parseInt(map.get(entry.piece.type_of_piece.name)) + 1);
            // masteryMap.set(entry.piece.period.name, masteryMap.get(entry.piece.period.name) + entry.mastery_level);
        }

        // for (let label of labels) {
        //     console.log(`${ masteryMap.get(label) / map.get(label)}`)
        //     masteryMap.set(label, masteryMap.get(label) / map.get(label));
        // }
        // console.log(`masterymap = ${[...masteryMap.entries()]}`);
        // console.log(`romantic = ${masteryMap.get('Romantic')}`)
        // setColors(Array.from(masteryMap.values()));
        setData(Array.from(map.values()));


    }, [types, userPieces])


    const fetchTypes = async () => {
        const url = `${host}/api/types/`
        try {
            const response = await fetch(url, {
                method: 'GET',
            
            });
            const jsonData = await response.json();
            let arr = [];
            for (let type of jsonData) {
                arr.push(type.name);
            }
            setTypes(arr);

        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };
    
    let rgb = ['#4b005c',
       '#aa005e',
        '#ef4647',
        '#ff9a19',
        '#fff100']

    return ( 
        <div className="chart-container">
            <Doughnut 
            data={{
                labels: types,
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
 
export default TypeChart;