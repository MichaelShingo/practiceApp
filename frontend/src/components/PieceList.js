import {ReactComponent as CheckMark} from '../svg/circle-check-solid.svg';
import {ReactComponent as PlusMark} from '../svg/circle-plus-solid.svg';
import {ReactComponent as OpenCircle} from '../svg/circle-regular.svg';
import { useRef, useState, useEffect } from 'react';
import { fetchMasteryUpdate, fetchRemovePiece, fetchAddPiece } from '../services/fetch.js';
import { useFirstRender } from '../services/firstRenderHook';
import { checkAuthenticated } from '../services/authService';
import Popup from './Popup.js';

const PieceList = ({piece,
                    updateCategoryCount,
                    userPieces,  
                    pieceIDSet,
                    setUserPieces,
                    updateCategoryMastery}) => {
    let initialMastery = null;
    if (checkAuthenticated()) {
        let initialMastery = userPieces.filter(userPiece => userPiece.piece.id === piece.id)
        .map(filteredPiece => (filteredPiece.mastery_level));
    } 
    
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
    const [popupClass, setPopupClass] = useState('popup hide-popup');
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});

    const firstRender = useFirstRender();
    
    useEffect(() => {
        if (checkAuthenticated() && pieceIDSet.has(piece.id)) {
            setChecked(true);
            setMasteryNum(userPieces.filter(userPiece => userPiece.piece.id === piece.id)
                .map(filteredPiece => (filteredPiece.mastery_level)));
                
            setUserPieceID(userPieces.filter(userPiece => userPiece.piece.id === piece.id)
                .map(filteredPiece => filteredPiece.id))
        } else {
            masteryLevel.current.disabled = true;
        }
    }, [])

    const handlePlusClick = () => {
        console.log(`plus clicked for id ${piece.id}`);
    }

    const toggleCheckMark = async (e) => {
        if (checkAuthenticated()) {
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
            masteryLevel.current.disabled = checked;
            setChecked(!checked);
        } else { // if not logged in
            setPopupPosition({x: e.clientX, y: e.clientY});
            setPopupClass('popup show-popup');
            setTimeout(() => {
                setPopupClass('popup hide-popup');
            }, 1500);

        }
           
        
        
        
    }

    useEffect(() => { 
        console.log(`first render = ${firstRender}`);
        if (masteryNum === null || masteryNum === '') {
            masteryLevel.current.style.backgroundColor = '#e6e6e6';
        } else {
            const hue = mapColorRange(masteryNum, 1, 1, 10, 118);
            masteryLevel.current.style.backgroundColor = `hsl(${hue}, 100%, 38%)`;

            if (checked) { 
                updateCategoryMastery(masteryNum - prevMasteryNum.current);
                console.log('updateCategoryMastery ran')
            }

            if (checked && userPieceID > 0) { // update mastery of already checked piece
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
                <Popup popupClass={popupClass} position={popupPosition} message="Login first!"/>
                <CheckMark 
                    className={!checked ? 'complete-icon hide-checkmark' : 'complete-icon'}
                    ref={checkMarkRef}
                />
                <OpenCircle 
                    className={checked ? 'open-icon hide-checkmark' : 'open-icon'}
                    onClick={(e) => toggleCheckMark(e)} 
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