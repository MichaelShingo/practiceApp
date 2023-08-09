import { useEffect, useRef } from 'react';
import '../styles/analytics.css';
const Analytics = ({ showAnalytics }) => {
    const containerRef = useRef(null);
    // useEffect(() => {
    //     setTimeout(() => {
    //         containerRef.current.style.position = !showAnalytics ? 'fixed' : 'absolute';

    //     }, 1000)

    // }, [showAnalytics])

    return ( 
        <div 
            ref={containerRef}
            className="analytics-container"
            style={{
                transform: !showAnalytics ? 'translateX(-100vw)' : 'translateX(0vw)',
                overflow: !showAnalytics ? 'hidden' : 'visible'
            }}
        >
            <h1>Analytics</h1>
        </div>
     );
}
 
export default Analytics;