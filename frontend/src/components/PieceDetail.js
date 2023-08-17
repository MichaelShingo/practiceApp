import { useEffect, useState, useContext } from 'react';
import {ReactComponent as CloseIcon} from '../svg/x-solid.svg';
import CircularProgress from './CircularProgress';
import { mapColorRange } from '../services/helperFunctions';
import Periods from './Periods';
import { TooltipContext } from '../App';



const PieceDetail = ({
    pieceDetailPiece,
    showDetail,
    setShowDetail,
    userPieces,
    periods,
}) => {

    const [mastery, setMastery] = useState(null);
    const [setShowTooltip, setMessage] = useContext(TooltipContext);
    const [created, setCreated] = useState('null');
    const [updated, setUpdated] = useState('null');

    const hue = mapColorRange(mastery, 1, 1, 10, 118);

    const formatDate = (dateString) => {

        if (dateString == 'null') {
            return "Not yet complete"
        }
        const date = new Date(dateString);
        
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
        
          const month = monthNames[date.getMonth()];
          const day = date.getDate();
          const year = date.getFullYear();
          let hours = date.getHours();
          const minutes = date.getMinutes();
          const amOrPm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
          const formattedDate = `${month} ${day}, ${year} ${hours.toString()}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
        
          return formattedDate;
    }
    useEffect(() => {
        const currentUserPiece = userPieces && pieceDetailPiece &&  userPieces.filter(userPiece => userPiece.piece.id === pieceDetailPiece.id);
        setMastery(currentUserPiece && currentUserPiece.length > 0 ? currentUserPiece[0].mastery_level : 0)
        setCreated(currentUserPiece && currentUserPiece.length > 0 ? currentUserPiece[0].created_at : 'null');
        setUpdated(currentUserPiece && currentUserPiece.length > 0 ? currentUserPiece[0].updated_at : 'null');

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
                setMessage(specifiedMessage)
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
                        <div className="col-6 techniques-col">
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
                            <h3>Composer</h3>
                            <div 
                                className="text-container"
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
                                <h4 
                                    onMouseEnter={() => handleOnMouseEnter('type')} 
                                    onMouseOut={handleOnMouseLeave}
                                >
                                    {pieceDetailPiece.type_of_piece.name}
                                </h4>
                            </div>     
                        </div>
                    </div> 
                    <div className="row">
                        <div className="col-6">
                            <h3>Completed</h3>
                            <div 
                                className="text-container"
                                style={{backgroundColor: created !== 'null' ? 'var(--color-accent' : 'var(--color-grey-2)'}}
                            >
                                <h4 
                                    onMouseEnter={() => handleOnMouseEnter('', 'When you checked this piece off.')}
                                    onMouseOut={handleOnMouseLeave}                             
                                >
                                    {created && formatDate(created)}
                                </h4>
                            </div>
                        </div>
                        <div className="col-6">
                            <h3>Updated</h3>
                            <div 
                                className="text-container"
                                style={{backgroundColor: updated !== 'null' ? 'var(--color-accent' : 'var(--color-grey-2)'}}
                            >
                                <h4 
                                    onMouseEnter={() => handleOnMouseEnter('', 'When you last updated the mastery for this piece.')}
                                    onMouseOut={handleOnMouseLeave}                             
                                >
                                    {updated && formatDate(updated)}
                                </h4>
                            </div>
                        </div>
                    </div>
            </div>
            )}
        </div>
     );
}
 
export default PieceDetail;