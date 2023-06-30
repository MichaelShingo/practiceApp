const PieceList = ({pieces}) => {
    // pieces is destructured from props

    return ( 
        <div className="piece-list">
            {
                pieces.map((piece) => (
                    <div className="piece-preview" key={piece.id}>
                        <h2>{ piece.title }</h2>
                        <p>{ piece.composer.first_name + ' ' + piece.composer.last_name}</p>
                        <p>{ piece.type_of_piece.name }</p>
                    </div>
                    )) 
            }
        </div>
     )
}
 
export default PieceList;