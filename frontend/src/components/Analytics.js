import { useEffect, useRef, useState } from 'react';
import '../styles/analytics.css';
import { host } from '../services/urls';
import DoughnutChart from './DoughnutChart';
import BarChart from './BarChart';
import TechniqueMastery from './TechniqueMastery';
import Calendar from './Calendar';
import '../styles/analyticsMediaQueries.css';

const Analytics = ({ showAnalytics, periods, userPieces, techniques }) => {
  const containerRef = useRef(null);
  const [types, setTypes] = useState([]);
  const [periodData, setPeriodData] = useState([]);
  const [typesData, setTypesData] = useState([1, 2, 3, 4, 5]);
  const [difficultyData, setDifficultyData] = useState(null);

  useEffect(() => {
    fetchTypes();
    calcPeriods();
    calcDifficulties();
  }, [userPieces]);

  const calcDifficulties = () => {
    const difficultyMap = new Map();
    for (let i = 1; i <= 10; i++) {
      difficultyMap.set(i, 0);
    }
    for (let userPiece of userPieces) {
      const difficulty = userPiece.piece.difficulty;
      const difficultyCount = difficultyMap.get(difficulty);
      difficultyMap.set(difficulty, difficultyCount + 1);
    }
    setDifficultyData(Array.from(difficultyMap.values()));
  };
  const calcPeriods = () => {
    let map = new Map();
    let masteryMap = new Map();
    for (let period of periods) {
      map.set(period.name, 0);
    }
    for (let entry of userPieces) {
      map.set(
        entry.piece.period.name,
        parseInt(map.get(entry.piece.period.name)) + 1
      );
    }
    setPeriodData(Array.from(map.values()));
  };

  const fetchTypes = async () => {
    const url = `${host}/api/types/`;
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
      }

      for (let entry of userPieces) {
        map.set(
          entry.piece.type_of_piece.name,
          parseInt(map.get(entry.piece.type_of_piece.name)) + 1
        );
      }

      setTypesData(Array.from(map.values()));
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="analytics-container"
        style={{
          // transform: !showAnalytics ? 'translateX(-100vw)' : 'translateX(0vw)',
          // overflow: !showAnalytics ? 'hidden' : 'visible',
          opacity: !showAnalytics ? '0' : '1',
          height: !showAnalytics ? '0px' : 'fit-content',
          padding: !showAnalytics ? '0px' : '15px',
        }}
      >
        <div className="chart-row chart-row-invisible">
          <div className="chart-row chart-row-doughnut" id="doughnut-left">
            <DoughnutChart
              labels={periods && periods.map((period) => period.name)}
              data={periodData}
              title={'Completion by Period'}
              colors={['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600']}
            />
          </div>
          <div className="chart-row chart-row-doughnut" id="doughnut-right">
            <DoughnutChart
              labels={types}
              data={typesData}
              title={'Completion by Type'}
              colors={['#4b005c', '#aa005e', '#ef4647', '#ff9a19', '#fff100']}
            />
          </div>
        </div>

        <div className="chart-row">
          {techniques && (
            <TechniqueMastery techniques={techniques} userPieces={userPieces} />
          )}
        </div>
        <div className="chart-row">
          <BarChart
            title="Completion by Difficulty Level"
            labels={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
            data={difficultyData}
          />
        </div>
        <div className="chart-row">
          <Calendar userPieces={userPieces} />
        </div>
      </div>
    </>
  );
};

export default Analytics;
