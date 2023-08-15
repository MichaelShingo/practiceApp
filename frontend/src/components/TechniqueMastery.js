import { useEffect, useState } from "react";
import TechniqueBox from "./TechniqueBox";
import Tooltip from './Tooltip.js'; 


const TechniqueMastery = ({ techniques, userPieces, handleOnMouseEnter, handleOnMouseLeave }) => {
    const [averages, setAverages] = useState(new Map());
    

    useEffect(() => {
        calcTechniqueMastery();
    }, [userPieces])

    const calcTechniqueMastery = () => {
        let averageMap = new Map();
        let countMap = new Map();
        for (let technique of techniques) {
            averageMap.set(technique.id, 0);
            countMap.set(technique.id, 0);
        }
        for (let userPiece of userPieces) {
            for (let tech of userPiece.piece.techniques) {
                countMap.set(tech.id, countMap.get(tech.id) + 1)
                averageMap.set(tech.id, averageMap.get(tech.id) + parseInt(userPiece.mastery_level))
            }
        }
        for (let tech of techniques) { 
            const count = countMap.get(tech.id);
            const avg = count !== 0 ? averageMap.get(tech.id) / countMap.get(tech.id) : -1;
            averageMap.set(tech.id, avg);
        }
        setAverages(averageMap);
    }

    

    return ( 
        <div className="chart-column" id="technique-chart">
            
            <h1>Technique by Mastery Level</h1>
            <div className="chart-container">
                {techniques.map(technique => (
                    <TechniqueBox 
                        technique={technique}
                        averages={averages}
                        handleOnMouseEnter={handleOnMouseEnter}
                        handleOnMouseLeave={handleOnMouseLeave}
                    />
                ))}
            </div>
        </div>
     );
}
 
export default TechniqueMastery;