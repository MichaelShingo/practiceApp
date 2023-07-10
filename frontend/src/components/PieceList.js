import {ReactComponent as CheckMark} from '../svg/circle-check-solid.svg';
import {ReactComponent as PlusMark} from '../svg/circle-plus-solid.svg';
import {ReactComponent as OpenCircle} from '../svg/circle-regular.svg';
import { useRef, useState, useEffect } from 'react';

const PieceList = ({piece,
                    updateCategoryCount,
                    userPieces,  
                    updateCategoryMastery}) => {

    const checkMarkRef = useRef(null);
    const openCircle = useRef(null);
    const masteryLevel = useRef(null);

    const [masteryNum, setMasteryNum] = useState(''); // set based on database value
    const [checked, setChecked] = useState(false);

    // if you update mastery level when it's not checked, automatically check

    useEffect(() => {
        // update dom to reflect userPieces
       
    }, [])

    const handlePlusClick = () => {
        console.log(`plus clicked for id ${piece.id}`);
    }

    const toggleCheckMark = async () => {
        setMasteryNum(10);
        const url = 'http://localhost:8000/api/user-piece/';
        const token = localStorage.getItem('authToken');
        const data = { // userID, pieceID, masteryLevel
            user: localStorage.getItem('userID'),
            piece: piece.id,
            mastery_level: 10
        }
        updateCategoryCount(!checked);
        if (!checked) { // add to database
            const response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
            
            if (!response.ok) {
                console.log(`Error saving piece. ${response.status}`)
            }

            console.log(response.data);

            
        } else { //remove from database
            const data = { // userID, pieceID, masteryLevel
                piece: piece.id,
            }
            console.log('removing from database')
            setMasteryNum('')
            const response = await fetch(url,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
            
            if (!response.ok) {
                console.log(`Error deleting piece. ${response.status}`)
            }

            console.log(response.status);
        }

        setChecked(!checked);


        
    }

    useEffect(() => {
        if (masteryNum === null || masteryNum === '') {
            masteryLevel.current.style.backgroundColor = '#e6e6e6';
        } else {
            const hue = mapColorRange(masteryNum, 1, 1, 10, 118);
            masteryLevel.current.style.backgroundColor = `hsl(${hue}, 100%, 38%)`;
            updateCategoryMastery();
        }
    }, [masteryNum])

    const mapColorRange = (value, x1, y1, x2, y2) => {
        return ((y2 - y1) / (x2 - x1)) * value;
    }

    const handleMasteryChange = () => {
        if (masteryLevel.current.value > 10) {
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