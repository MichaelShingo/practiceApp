import PieceList from './PieceList.js';
import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { mapColorRange } from '../services/helperFunctions.js';
import { checkAuthenticated } from '../services/authService.js';

const Category = ({ 
    category, 
    pieces, 
    updateGlobalProgress, 
    userPieces,
    pieceIDSet,
    setPieceIDSet,
    setUserPieces,
    filteredPieces,
    pieceCount,
    searchState,
    filteredPieceIDs,
    setPieceDetailPiece,
    showDetail,
    setShowDetail,
    updateGlobalMastery }, ref) => {

    const calcCSSPercentage = (numerator, denominator) => {
        let percentage = count / categoryCount * 100;
        return `${percentage.toString()}%`;
    }

    const calcCategoryCount = () => { // sets total count of pieces in category
        let counter = 0;
        for (let piece of filteredPieces) {
            if (piece.category.name === category.name) { 
                counter++;
            }
        }
        setCategoryCount(counter);
        // filteredPieces.filter((piece) => piece.category.name === category.name)
    }

    // useEffect(() => {
    //     setMasterySum(0);
    // }, [filteredPieces])

    const progressRef = useRef(null);
    const pieceTableRef = useRef(null);

    const [count, setCount] = useState(0); //set this based on data in database
    const [totalCount, setTotalCount] = useState(pieces.filter((piece) => piece.category.name === category.name).length);
    const [progressPercent, setProgressPercent] = useState('0%');
    const [avgMastery, setAvgMastery] = useState(0);
    const [masterySum, setMasterySum] = useState(0);
    const prevMasterySum = useRef(0);
    const [categoryCount, setCategoryCount] = useState(0); // total count of pieces in category, including filters
    
    useEffect(() => {
        setCount(0);
        calcCategoryCount();

        if (checkAuthenticated()) {
            for (let userPiece of userPieces) {
                if (userPiece.piece.category === category.id && filteredPieceIDs.has(userPiece.piece.id)) {
                    setCount(prevCount => prevCount + 1);
                }
            }
        }
    }, [filteredPieceIDs]);

    useEffect(() => {
        calcCategoryCount();
    }, [pieceCount])


    useEffect(() => {
        // console.log(`count, masterySum, totalCount, categoryCount = ${count}, ${masterySum}, ${totalCount} ${categoryCount}`)
        setProgressPercent(calcCSSPercentage(count, totalCount));
        if (count === 0) {
            setAvgMastery(0);
        } else {
            setAvgMastery(masterySum / count);
            // console.log('setting avg mastsery');
        }
    }, [masterySum, count]);

    useEffect(() => {
        const hue = mapColorRange(avgMastery, 1, 1, 10, 118);
        // console.log(`avgMastery = ${avgMastery}`);
        progressRef.current.style.backgroundColor = `hsl(${hue}, 100%, 38%)`;
    }, [avgMastery])


    const togglePieceTable = (e) => {
        e.stopPropagation();
        pieceTableRef.current.classList.toggle('hide-pieces-table');
    }

    const handlePiecesTableClick = (e) => {
        e.stopPropagation();
    }

    const updateCategoryCount = (increment, currentMastery) => {
        if (increment) { 
            // console.log(`updateCategoryCount ran, currentMastery = ${currentMastery}`)
            setCount(count => count + 1);
        } else {
            setCount(count => count - 1);
        }
        updateGlobalProgress(increment);
    }

    useEffect(() => { // when you filter....can you recalculate the masterySum?
        // setMasterySum(0); sets to 0 and keeps at 0 on filter 
        // how do you reset the count BEFORE, incrementing with updates? 
        setMasterySum(sum => sum - prevMasterySum.current);
    }, [searchState])

    const updateCategoryMastery = (difference) => {
        // THIS RUNS ONLY ONCE ON RENDER, GOOD 
        // console.log(`MASTERY SUM = ${masterySum}`);
        prevMasterySum.current = masterySum;
        setMasterySum(prevSum => parseInt(prevSum) + parseInt(difference));
    }

    return ( 
        <div 
            className="category-row" 
            key={category.id}
            ref={ref}
            onClick={(e) => togglePieceTable(e)}
            style={categoryCount === 0 ? {display: 'none'} : {display: 'block'}}
        >
            {/* <p>{categoryCount}</p> */}
            <div className="row">
                <div className="col-6 no-margin">
                    <h2>{ category.name }</h2>
                </div>
                <div className="col-6 progress-container no-margin">
                    <h2 className="fraction">{count}/{categoryCount}</h2>
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
                    {filteredPieces.filter((piece) => piece.category.name === category.name).map((piece) => (
                        <PieceList 
                            key={piece.id}
                            piece={piece}
                            filteredPieces={filteredPieces}
                            userPieces={userPieces}
                            category={category} 
                            updateGlobalProgress={updateGlobalProgress}
                            updateCategoryMastery={updateCategoryMastery}
                            updateGlobalMastery={updateGlobalMastery}
                            updateCategoryCount={updateCategoryCount}
                            pieceIDSet={pieceIDSet}
                            setShowDetail={setShowDetail}
                            showDetail={showDetail}
                            setPieceIDSet={setPieceIDSet}
                            setUserPieces={setUserPieces}
                            setPieceDetailPiece={setPieceDetailPiece}
                        />
                    ))}    
                    </tbody>
                </table>
            </div>
        </div>
     );
}

export default React.forwardRef(Category)
 
