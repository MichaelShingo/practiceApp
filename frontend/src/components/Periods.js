const Periods = ({ period, pieceDetailPiece, handleOnMouseEnter, handleOnMouseLeave }) => {
    
    return (           
        <p 
            onMouseEnter={() => handleOnMouseEnter('period', period.description)} 
            onMouseLeave={handleOnMouseLeave}
            className={pieceDetailPiece.period.id === period.id ? 'period-name match' : 'period-name'}
        >
            {period.name}
        </p>
                
     )
}
 
export default Periods;