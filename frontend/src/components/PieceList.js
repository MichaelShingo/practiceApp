const PieceList = ({pieces}) => {
    // pieces is destructured from props

    return ( 
        <tr className="piece-list">
            {
                pieces.map((piece) => (
                    <tr className="piece-preview" key={piece.id}>
                        <td>{ piece.title }</td>
                        <td>{ piece.composer.first_name + ' ' + piece.composer.last_name}</td>
                        <td>{ piece.type_of_piece.name }</td>
                    </tr>
                    )) 
            }
        </tr>
     )
}
 
export default PieceList;