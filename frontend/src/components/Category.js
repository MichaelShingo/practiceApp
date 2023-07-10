import PieceList from './PieceList.js';
import React from 'react';
import { useRef, useState, useEffect } from 'react';


const Category = ({ 
    category, 
    pieces, 
    updateGlobalProgress, 
    userPieces,
    updateGlobalMastery }, ref) => {

    // useRef to select the progress bar and count
    // can you update them more reliably in this component? 

    const calcCSSPercentage = (numerator, denominator) => {
        let percentage = count / totalCount * 100;
        return `${percentage.toString()}%`;
    }

    const progressRef = useRef(null);
    const pieceTableRef = useRef(null);

    const [count, setCount] = useState(0); //set this based on data in database
    const [totalCount, setTotalCount] = useState(pieces.filter((piece) => piece.category.name === category.name).length);
    const [progressPercent, setProgressPercent] = useState('0%');


    useEffect(() => {
        //check how many pieces have category.id that matches this category
        for (let userPiece of userPieces) {
            if (userPiece.piece.category.id === category.id) {
                setCount(count => count + 1);
            }
        }

    }, []);

    useEffect(() => {
        setProgressPercent(calcCSSPercentage(count, totalCount));
        

    }, [count]);



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
                        />
                    ))}
                        
                        
                    </tbody>
                </table>
            </div>
        </div>
     );
}

export default React.forwardRef(Category)
 
