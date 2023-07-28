import { useEffect, useState } from "react";
import { useSpring, animated } from 'react-spring';
import CountUp from 'react-countup';

const CircularProgress = ({
    startVal,
    endVal,
    speed,
    showDetail,
    componentNum,
}) => {
    const [progressVal, setProgressVal] = useState(startVal);
    const [progressEnd, setProgressEnd] = useState(endVal);

    const { number } = useSpring({
        from: { number: 0 },
        to: { number: endVal },
        number: 10,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    return ( 

        <div className="circle-progress-container">
            <style>{`
            .circle-progress-container circle {
                animation: anim${componentNum} 1s linear forwards;
            }
                @keyframes anim${componentNum} {
                    100% {
                        stroke-dashoffset: ${472 - (endVal * 47.2)}
                    }
            `}
            </style>
            <div className="outer">
                <div className="inner">
                    <animated.div className="animated-val">{number.to((n) => n.toFixed(endVal))}</animated.div>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                <defs>
                    <linearGradient id="GradientColor">
                    <stop offset="0%" stop-color="#e91e63" />
                    <stop offset="100%" stop-color="#673ab7" />
                    </linearGradient>
                </defs>
                <circle cx="80" cy="80" r="70" stroke-linecap="round" />
            </svg>
        </div>
        
     );
}
 
export default CircularProgress;