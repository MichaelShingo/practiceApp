import { useEffect, useRef, useState } from 'react';
import '../styles/analytics.css';
import PeriodChart from './PeriodChart';
import TypeChart from './TypeChart';

const Analytics = ({ 
    showAnalytics,
    periods,
    userPieces
}) => {
    const containerRef = useRef(null);
    // const [periodData, setPeriodData] = useState({
    //     labels: [],
    //     datasets: []
    // })

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
                
                <div className="chart-column">
                <h1>Completion by Period</h1>

                    <PeriodChart 
                        periods={periods}
                        userPieces={userPieces}
                    
                    />
                </div>
                
                <div className="chart-column">
                    <h1>Completion by Type</h1>

                    <TypeChart 
                        userPieces={userPieces}
                    />
                </div>
                
            </div>
            
        </div>
     );
}
 
export default Analytics;