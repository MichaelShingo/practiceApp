import {ReactComponent as CheckMark} from '../svg/circle-check-solid.svg';
import {ReactComponent as PlusMark} from '../svg/circle-plus-solid.svg';
import {ReactComponent as OpenCircle} from '../svg/circle-regular.svg';
import { useRef, useState, useEffect } from 'react';
import { fetchMasteryUpdate, fetchRemovePiece, fetchAddPiece } from '../services/fetch.js';

const PieceList = ({piece,
                    updateCategoryCount,
                    userPieces,  
                    pieceIDSet,
                    setUserPieces,
                    updateCategoryMastery}) => {
    
    let initialMastery = userPieces.filter(userPiece => userPiece.piece.id === piece.id)
        .map(filteredPiece => (filteredPiece.mastery_level));
    if (isNaN(parseInt(initialMastery))) {
        initialMastery = null;
    }
                      
    const checkMarkRef = useRef(null);
    const openCircle = useRef(null);
    const masteryLevel = useRef(null);
    const prevMasteryNum = useRef(initialMastery);

    const [masteryNum, setMasteryNum] = useState(initialMastery); // set based on database value
    const [checked, setChecked] = useState(false);
    const [userPieceID, setUserPieceID] = useState(0);
    
    useEffect(() => {
        if (pieceIDSet.has(piece.id)) {
            setChecked(true);
            setMasteryNum(userPieces.filter(userPiece => userPiece.piece.id === piece.id)
                .map(filteredPiece => (filteredPiece.mastery_level)));
                
            setUserPieceID(userPieces.filter(userPiece => userPiece.piece.id === piece.id)
                .map(filteredPiece => filteredPiece.id))
        }
    }, [])

    const handlePlusClick = () => {
        console.log(`plus clicked for id ${piece.id}`);
    }

    const toggleCheckMark = async () => {
        if (!checked) { // add to database
            setMasteryNum(10);
            const jsonData = await fetchAddPiece(piece.id, 10);
            setUserPieceID(jsonData.id)
            updateCategoryCount(!checked, 10);
        } else { //remove from database
            console.log(masteryNum);
            updateCategoryCount(!checked, masteryNum);
            setMasteryNum('')
            fetchRemovePiece(piece.id);
        }
        setChecked(!checked);
    }

    useEffect(() => { 
        if (masteryNum === null || masteryNum === '') {
            masteryLevel.current.style.backgroundColor = '#e6e6e6';
        } else {
            const hue = mapColorRange(masteryNum, 1, 1, 10, 118);
            masteryLevel.current.style.backgroundColor = `hsl(${hue}, 100%, 38%)`;
            if (checked) {
                updateCategoryMastery(masteryNum - prevMasteryNum.current);
                console.log('updateCategoryMastery ran')
                // what happens when mastery goes from null to 10 and this runs? 
            }
            if (checked && userPieceID > 0) { // this is running 
                fetchMasteryUpdate(userPieceID, masteryNum);
            } 
        }
        prevMasteryNum.current = masteryNum;
    }, [masteryNum])

    const mapColorRange = (value, x1, y1, x2, y2) => {
        return ((y2 - y1) / (x2 - x1)) * value;
    }

    const handleMasteryChange = async () => {
        if (!checked) {
            setMasteryNum(masteryLevel.current.value);
            setChecked(true);
            updateCategoryCount(true);
            const jsonData = await fetchAddPiece(piece.id, masteryLevel.current.value);
            setUserPieceID(jsonData.id) 
        }

        if (masteryLevel.current.value > 10 || masteryLevel.current.value == NaN) {
            setMasteryNum(10);
        } else if (masteryLevel.current.value < 0) {
            setMasteryNum(0);            
        } else {
            setMasteryNum(masteryLevel.current.value);
        }
    }

    return ( 
        <tr className="piece-preview" >
            <td className="title-col">{ piece.title }</td>
            <td>
                <CheckMark 
                    className={!checked ? 'complete-icon hide-checkmark' : 'complete-icon'}
                    ref={checkMarkRef}
                />
                <OpenCircle 
                    className={checked ? 'open-icon hide-checkmark' : 'open-icon'}
                    onClick={toggleCheckMark} 
                    ref={openCircle}
                />
            </td>
            <td>{piece.difficulty}</td>
            <td className="mastery-row">
                <input 
                    ref={masteryLevel}
                    className="mastery-number" 
                    type="number"  
                    min="0" 
                    max="10"
                    value={masteryNum}
                    onChange={handleMasteryChange}
                />
                {/* <div className="mastery-rating"></div> */}
            </td>
            <td><PlusMark onClick={handlePlusClick} className="plus-icon" /></td>
        </tr>
     )
}
 
export default PieceList;