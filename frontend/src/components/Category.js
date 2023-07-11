import PieceList from './PieceList.js';
import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { mapColorRange } from '../services/helperFunctions.js';

const Category = ({ 
    category, 
    pieces, 
    updateGlobalProgress, 
    userPieces,
    pieceIDSet,
    setUserPieces,
    updateGlobalMastery }, ref) => {

    const calcCSSPercentage = (numerator, denominator) => {
        let percentage = count / totalCount * 100;
        return `${percentage.toString()}%`;
    }

    const progressRef = useRef(null);
    const pieceTableRef = useRef(null);

    const [count, setCount] = useState(0); //set this based on data in database
    const [totalCount, setTotalCount] = useState(pieces.filter((piece) => piece.category.name === category.name).length);
    const [progressPercent, setProgressPercent] = useState('0%');
    const [avgMastery, setAvgMastery] = useState(10);
    const [masterySum, setMasterySum] = useState(0);
    

    useEffect(() => {
        setCount(0);
        setMasterySum(0);
        for (let userPiece of userPieces) {
            if (userPiece.piece.category === category.id) {
                setCount(count => count + 1);
                setMasterySum(masterySum => (masterySum + userPiece.mastery_level));
            }
        }
    }, []);

    useEffect(() => {
        console.log(`count, masterySum = ${count, masterySum}`)
        setProgressPercent(calcCSSPercentage(count, totalCount));
        setAvgMastery(masterySum / count);
    }, [masterySum, count]);

    useEffect(() => {
        const hue = mapColorRange(avgMastery, 1, 1, 10, 118);
        console.log(`avgMastery = ${avgMastery}`);
        progressRef.current.style.backgroundColor = `hsl(${hue}, 100%, 38%)`;
    }, [avgMastery])



    const togglePieceTable = (e) => {
        e.stopPropagation();
        pieceTableRef.current.classList.toggle('hide-pieces-table');
    }

    const handlePiecesTableClick = (e) => {
        e.stopPropagation();
    }

    const updateCategoryCount = (increment) => {
        if (increment) {
            setCount(count => count + 1);
        } else {
            setCount(count => count - 1);
        }
        updateGlobalProgress(increment);
    }

    const updateCategoryMastery = () => {

        // When you add a new piece, update category mastery mastery
        // When you update mastery, update category mastery


    }

    return ( 
        <div 
            className="category-row" 
            key={category.id}
            ref={ref}
            onClick={(e) => togglePieceTable(e)}
        >
            <div className="row">
                <div className="col-6 no-margin">
                    <h2>{ category.name }</h2>
                </div>
                <div className="col-6 progress-container no-margin">
                    <h2 className="fraction">{count}/{totalCount}</h2>
                    <div className="progress-bar-container">
                        <div ref={progressRef} className="progress-bar" style={{width: progressPercent}}></div>
                        <div className="progress-bar-back"></div>
                    </div>
                    
                </div>
            </div>
            <div className="table-body" onClick={(e) => handlePiecesTableClick(e)}>
                <table ref={pieceTableRef} className="pieces-table hide-pieces-table">
                    <thead>
                        <tr>
                            <th className="title-head">Title</th>
                            <th>Complete</th>
                            <th>Difficulty</th>
                            <th>Mastery</th>
                            <th>More</th>
                        </tr>
                    </thead>
                    <tbody>
                    {pieces.filter((piece) => piece.category.name === category.name).map((piece) => (
                        <PieceList 
                            key={piece.id}
                            piece={piece} 
                            userPieces={userPieces}
                            category={category} 
                            updateGlobalProgress={updateGlobalProgress}
                            updateCategoryMastery={updateCategoryMastery}
                            updateGlobalMastery={updateGlobalMastery}
                            updateCategoryCount={updateCategoryCount}
                            pieceIDSet={pieceIDSet}
                            setUserPieces={setUserPieces}
                        />
                    ))}    
                    </tbody>
                </table>
            </div>
        </div>
     );
}

export default React.forwardRef(Category)
 
