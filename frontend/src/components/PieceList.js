import {ReactComponent as CheckMark} from '../svg/circle-check-solid.svg';
import {ReactComponent as PlusMark} from '../svg/circle-plus-solid.svg';
import {ReactComponent as OpenCircle} from '../svg/circle-regular.svg';
import { useRef, useState, useEffect } from 'react';
import { fetchMasteryUpdate, fetchRemovePiece, fetchAddPiece } from '../services/fetch.js';
import { useIsFirstRender } from '../services/firstRenderHook';
import { checkAuthenticated } from '../services/authService';
import Popup from './Popup.js';

const PieceList = ({piece,
                    updateCategoryCount,
                    userPieces,  
                    pieceIDSet,
                    setPieceIDSet,
                    setUserPieces,
                    filteredPieces,
                    firstFetch,
                    setFirstFetch,
                    updateCategoryMastery}) => {
    let initialMastery = '';
    if (checkAuthenticated()) {
        let initialMastery = userPieces.filter(userPiece => userPiece.piece.id === piece.id)
        .map(filteredPiece => (filteredPiece.mastery_level));
    } 
    
    if (isNaN(parseInt(initialMastery))) {
        initialMastery = '';
    }
                      
    const checkMarkRef = useRef(null);
    const openCircle = useRef(null);
    const masteryLevel = useRef('');
    const prevMasteryNum = useRef(initialMastery);

    const firstMount = useRef(true);

    let renderCount = useRef(0);
    renderCount.current = renderCount.current + 1;

    const currentUserPiece = userPieces.filter(userPiece => userPiece.piece.id === piece.id);
    // console.log(`currentUserPiece = ${JSON.stringify(currentUserPiece[0].mastery_level)}`)

    // const [masteryNum, setMasteryNum] = useState(initialMastery); // set based on database value
    const [masteryNum, setMasteryNum] = useState(currentUserPiece.length > 0 ? currentUserPiece[0].mastery_level : '')
    const [checked, setChecked] = useState(false);
    const [userPieceID, setUserPieceID] = useState(0);
    const [popupClass, setPopupClass] = useState('popup hide-popup');
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});
    const [runCount, setRunCount] = useState(0);
    const [showPiece, setShowPiece] = useState(true);
    
    useEffect(() => {
        if (checkAuthenticated() && pieceIDSet.has(piece.id)) { // set user pieces, checked, mastery level
            // console.log(`this is running after filter????`);
            // can you get this to run ONLY when you first pull from the database? 
            // maybe have a state in the top level that sets false after pull? 
            setChecked(true);
            // setMasteryNum(userPieces.filter(userPiece => userPiece.piece.id === piece.id)
            //     .map(filteredPiece => (filteredPiece.mastery_level))); // set this as intiial value instead
             
            setUserPieceID(userPieces.filter(userPiece => userPiece.piece.id === piece.id)
                .map(filteredPiece => filteredPiece.id))            
        } else {
            masteryLevel.current.disabled = true;
        }
    }, [])

    const handlePlusClick = () => {
        console.log(`plus clicked for id ${piece.id}`);
    }

    useEffect(() => { // when you filter....can you recalculate the masterySum?
        if (checked) {
            console.log(`UPDATING CATEGORY MASTERY`)
            updateCategoryMastery(masteryNum);
            updateCategoryCount(true);
        }
        
    }, [filteredPieces])

    const toggleCheckMark = async (e) => {
        masteryLevel.current.disabled = checked;
        setChecked(!checked);
        if (checkAuthenticated()) {
            if (!checked) { // add to database
                setMasteryNum(10);
                const jsonData = await fetchAddPiece(piece.id, 10);
                setUserPieceID(jsonData.id)
                updateCategoryCount(!checked, 10);
                updateCategoryMastery(10);
                console.log(`${jsonData} ${typeof jsonData}`);
                setUserPieces([...userPieces, jsonData ]);
                let updatedPieceIDSet = new Set(pieceIDSet);
                updatedPieceIDSet.add(piece.id);
                setPieceIDSet(updatedPieceIDSet);
                console.log(userPieces);
                
            } else { //remove from database
                updateCategoryCount(!checked, masteryNum);
                updateCategoryMastery(-1 * masteryNum);
                setMasteryNum('')
                fetchRemovePiece(piece.id);
                setUserPieces(userPieces.filter(element => element.piece.id !== piece.id));
                let updatedPieceIDSet = new Set(pieceIDSet);
                updatedPieceIDSet.delete(piece.id);
                setPieceIDSet(updatedPieceIDSet);
            }
            
        } else { // if not logged in
            setPopupPosition({x: e.clientX, y: e.clientY});
            setPopupClass('popup show-popup');
            setTimeout(() => {
                setPopupClass('popup hide-popup');
            }, 1500);

        }
    }

    useEffect(() => { 
        if (masteryNum === null || masteryNum === '') {
            masteryLevel.current.style.backgroundColor = '#e6e6e6';
        } else { // when you check an entry, update existing mastery, or fetch saved pieces
            const hue = mapColorRange(masteryNum, 1, 1, 10, 118);
            masteryLevel.current.style.backgroundColor = `hsl(${hue}, 100%, 38%)`;
            
            if (runCount === 0 && userPieceID === 0) { 
                setRunCount(prevRunCount => prevRunCount + 1);
            } else if (checked && userPieceID > 0) { // update mastery of already checked piece
                // this is running when you uncheck a piece? 
                firstMount.current = false;
                fetchMasteryUpdate(userPieceID, masteryNum);
                updateCategoryMastery(masteryNum - prevMasteryNum.current);

                let userPiecesCopy = [...userPieces];
                let pieceIndex = userPiecesCopy.findIndex((element) => (element.id === parseInt(userPieceID)));
                if (pieceIndex !== -1) {
                    const updatedPiece = userPiecesCopy[pieceIndex];
                    updatedPiece.mastery_level = masteryNum;
                    userPiecesCopy[pieceIndex] = updatedPiece;
                    setUserPieces(userPiecesCopy);
                }
                
            } 
        }
        prevMasteryNum.current = masteryNum;
    }, [masteryNum])

    const mapColorRange = (value, x1, y1, x2, y2) => {
        return ((y2 - y1) / (x2 - x1)) * value;
    }

    const handleMasteryChange = async () => {
        if (!checked) { // when you check 
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
        <tr className="piece-preview"  >
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