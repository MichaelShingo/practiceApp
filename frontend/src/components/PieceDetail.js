import { useEffect, useState } from 'react';
import {ReactComponent as CloseIcon} from '../svg/x-solid.svg';
import CircularProgress from './CircularProgress';
import { mapColorRange } from '../services/helperFunctions';

const PieceDetail = ({
    pieceDetailPiece,
    showDetail,
    setShowDetail,
    userPieces,
}) => {

    const [mastery, setMastery] = useState(null)
    const hue = mapColorRange(mastery, 1, 1, 10, 118);
    useEffect(() => {
        const currentUserPiece = userPieces && pieceDetailPiece &&  userPieces.filter(userPiece => userPiece.piece.id === pieceDetailPiece.id);
        setMastery(currentUserPiece && currentUserPiece.length > 0 ? currentUserPiece[0].mastery_level : 0)


    }, [userPieces, pieceDetailPiece])

    const handleClose = () => {
        setShowDetail(prev => !prev);
    }

    const handleContainerClick = (e) => {
        e.stopPropagation();
    }

    return ( 
        
        <div 
            className="detail-background" 
            style={showDetail ? {display: 'block'} : {display: 'none'}}
            onClick={handleClose}
        >
            {pieceDetailPiece && (
                <div className="detail-container" onClick={(e) => handleContainerClick(e)}>
                    <CloseIcon className="close-icon" onClick={handleClose}/>
                    <h1>{pieceDetailPiece.title}</h1>
                    <h2>{`from ${pieceDetailPiece.category.name}`}</h2>
                    <div className="row">
                        <div className="col-4">
                        <h3>Difficulty</h3>
                            <CircularProgress 
                                size={200}
                                strokeWidth={20}
                                percentage={showDetail ? pieceDetailPiece.difficulty * 10 : 0}
                                color={`hsl(${118 - mapColorRange(pieceDetailPiece.difficulty, 1, 1, 10, 118)}, 100%, 38%`}
                            />
                        </div>
                        <div className="col-4">
                            <h3>Period</h3>
                            <p>{pieceDetailPiece.period.name}</p>
                        </div>
                        <div className="col-4">
                            <h3>Mastery</h3>
                            <CircularProgress
                                size={200}
                                strokeWidth={20}
                                percentage={showDetail ? mastery * 10 : 0}
                                color={`hsl(${hue}, 100%, 38%`}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                        <h3>Techniques</h3>
                            <div className="technique-detail-container">     
                                {pieceDetailPiece.techniques.map((technique) => (
                                    <div className="technique-tag">
                                        <p className="technique-detail">{technique.name}</p>
                                    </div>
                                    ))}       
                            </div>
                        </div>
                        <div className="col-6">
                            <h3>Composer</h3>
                            <div className="text-container">
                                <h4>{`${pieceDetailPiece.composer.first_name} ${pieceDetailPiece.composer.last_name}`}</h4>
                            </div>
                            <h3>Type</h3>
                            <div className="text-container">
                                <h4>{pieceDetailPiece.type_of_piece.name}</h4>
                            </div>
                        </div>
                    </div> 
            </div>
            )}
        </div>
    
     );
}
 
export default PieceDetail;