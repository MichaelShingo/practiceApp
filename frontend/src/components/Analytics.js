import { useEffect, useRef, useState } from 'react';
import '../styles/analytics.css';
import PeriodChart from './PeriodChart';
import { host } from '../services/urls';
import DoughnutChart from './DoughnutChart';


const Analytics = ({ 
    showAnalytics,
    periods,
    userPieces
}) => {

    const containerRef = useRef(null);
    const [types, setTypes] = useState([]);
    let [periodData, setPeriodData] = useState([]);

    let [typesData, setTypesData] = useState([1, 2, 3, 4, 5]);

    useEffect(() => {
        fetchTypes();
        calcPeriods();

    }, [userPieces])

    const calcPeriods = () => {
        let map = new Map();
        let masteryMap = new Map();
        for (let period of periods) {
            map.set(period.name, 0);
        }
        for (let entry of userPieces) {
            map.set(entry.piece.period.name, parseInt(map.get(entry.piece.period.name)) + 1);
        }
        setPeriodData(Array.from(map.values()));
    }

    const fetchTypes = async () => {
        const url = `${host}/api/types/`
        let map = new Map();

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

            for (let type of arr) {
                map.set(type, 0);
                console.log(`types = ${type}`)
            }
            
            for (let entry of userPieces) {
                map.set(entry.piece.type_of_piece.name, parseInt(map.get(entry.piece.type_of_piece.name)) + 1);
            }
    
            setTypesData(Array.from(map.values()));

        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };
    
    return ( 
        <div 
            ref={containerRef}
            className="analytics-container"
            style={{
                // transform: !showAnalytics ? 'translateX(-100vw)' : 'translateX(0vw)',
                // overflow: !showAnalytics ? 'hidden' : 'visible',
                opacity: !showAnalytics ? '0' : '1',
                height: !showAnalytics ? '0px' : 'fit-content',
                padding: !showAnalytics ? '0px' : '15px'
            }}
        >
            <div className="chart-row">
                <DoughnutChart 
                    labels={periods.map(period => period.name)}
                    data={periodData}
                    title={'Completion by Period'}
                    colors={['#003f5c', '#58508d',
                     '#bc5090', '#ff6361', '#ffa600']}
                />
                <DoughnutChart 
                    labels={types}
                    data={typesData}
                    title={'Completion by Type'}
                    colors={['#4b005c', '#aa005e',
                    '#ef4647', '#ff9a19', '#fff100']}
                />
            </div>
        </div>
     );
}
 
export default Analytics;