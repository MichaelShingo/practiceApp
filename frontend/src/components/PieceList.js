import {ReactComponent as CheckMark} from '../svg/circle-check-solid.svg';
import {ReactComponent as PlusMark} from '../svg/circle-plus-solid.svg';
import {ReactComponent as OpenCircle} from '../svg/circle-regular.svg';

const PieceList = ({piece, category, toggleCheckMark, handleMasteryChange}) => {
    return ( 
        <tr className="piece-preview" key={piece.id} listID={piece.id} categoryID={category.id} >
            <td className="title-col">{ piece.title }</td>
            <td>
                <CheckMark 
                    className="complete-icon"
                    
                />
                <OpenCircle 
                    className="open-icon hide-checkmark" 
                    onClick={(e) => toggleCheckMark(e)} 
                />
                
            </td>
            <td>5</td>
            <td className="mastery-row">
                <input 
                    className="mastery-number" 
                    categoryID={category.id}
                    type="number"  
                    min="0" 
                    max="10"
                    onChange={(e) => handleMasteryChange(e)}
                />
                {/* <div className="mastery-rating"></div> */}
            </td>
            <td><PlusMark className="plus-icon" /></td>
        </tr>
     )
}
 
export default PieceList;