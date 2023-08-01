import { useEffect, useState } from 'react';
import {ReactComponent as CloseIcon} from '../svg/x-solid.svg';
import CircularProgress from './CircularProgress';
import { mapColorRange } from '../services/helperFunctions';
import Periods from './Periods';
import Tooltip from './Tooltip';


const PieceDetail = ({
    pieceDetailPiece,
    showDetail,
    setShowDetail,
    userPieces,
    periods,
}) => {

    const [mastery, setMastery] = useState(null);
    const [message, setMessage] = useState('234234234234234234');
    const [showTooltip, setShowTooltip] = useState(false);

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

    const handleOnMouseEnter = (id, specifiedMessage) => {
        setShowTooltip(true);
        switch(id) {
            case 'composer':
                setMessage(pieceDetailPiece.composer.description)
                break;
            case 'type':
                setMessage(pieceDetailPiece.type_of_piece.description);
                break;
            case 'period':
                setMessage(specifiedMessage);
                break;
            case 'technique':
                setMessage(specifiedMessage);
                break;
            default:
                break;
        }
    }

    const handleOnMouseLeave = () => {
        setShowTooltip(false);

    }

    return ( 
        <div 
            className="detail-background" 
            style={showDetail ? {display: 'block'} : {display: 'none'}}
            onClick={handleClose}
            key={pieceDetailPiece && pieceDetailPiece.id}
        >
            <Tooltip
                visible={showTooltip}
                message={message}
            />
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
                            <div className="period-container">
                                {periods && periods.map(period => (
                                    <Periods 
                                        pieceDetailPiece={pieceDetailPiece}
                                        period={period}
                                        handleOnMouseEnter={handleOnMouseEnter}
                                        handleOnMouseLeave={handleOnMouseLeave}
                                    />
                                ))}
                            </div>
                            
                            
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
                                    <div onMouseEnter={() => handleOnMouseEnter('technique', technique.description)} onMouseLeave={handleOnMouseLeave} className="technique-tag">
                                        <p className="technique-detail">{technique.name}</p>
                                    </div>
                                    ))}       
                            </div>
                        </div>
                        <div className="col-6">
                            {/* <Tooltip 
                                id="composer"
                                place="right" 
                            /> */}
                            <h3>Composer</h3>
                            <div 
                                className="text-container"
                                data-tooltip-id="composer"
                                data-tooltip-content="Heinrich Ernst Kayser (16 April 1815 in Altona, Hamburg – 17 January 1888 in Hamburg) was a German violinist, violist, pedagogue and composer."
                            >
                                <h4 
                                    onMouseEnter={() => handleOnMouseEnter('composer')}
                                    onMouseOut={handleOnMouseLeave}                             
                                >
                                    {`${pieceDetailPiece.composer.first_name} ${pieceDetailPiece.composer.last_name}`}
                                </h4>
                            </div>
                            <h3>Type</h3>
                            <div className="text-container">
                                <h4 onMouseEnter={() => handleOnMouseEnter('type')} onMouseOut={handleOnMouseLeave}>{pieceDetailPiece.type_of_piece.name}</h4>
                            </div>
                        </div>
                    </div> 
            </div>
            )}
        </div>
    
     );
}
 
export default PieceDetail;