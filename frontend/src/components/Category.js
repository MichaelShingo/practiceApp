import PieceList from './PieceList.js';


const Category = ({ category, pieces, handlePiecesTableClick, togglePieceTable, toggleCheckMark, handleMasteryChange }) => {
    return ( 
        <div 
            className="category-row" 
            key={category.id}
            listID={category.id}
            onClick={(e) => togglePieceTable(e, category.id)}
        >
            <div className="row">
                <div className="col-6 no-margin">
                    <h2>{ category.name }</h2>
                </div>
                <div className="col-6 progress-container no-margin">
                    <h2 categoryID={category.id} className="fraction">22/{pieces.filter((piece) => piece.category.name === category.name).length}</h2>
                    <div className="progress-bar-container">
                        <div categoryID={category.id} className="progress-bar" style={{}}></div>
                        <div className="progress-bar-back"></div>
                    </div>
                    
                </div>
            </div>
            <div className="table-body" onClick={(e) => handlePiecesTableClick(e)}>
                <table className="pieces-table hide-pieces-table">
                    <thead>
                        <tr>
                            <th className="title-head">Title</th>
                            <th>Complete</th>
                            <th>Difficulty</th>
                            <th>Mastery</th>
                            <th>More</th>
                        </tr>
                    </thead>
                    <tbody>
                    {pieces.filter((piece) => piece.category.name === category.name).map((piece) => (
                        <PieceList 
                            piece={piece} 
                            category={category} 
                            toggleCheckMark={toggleCheckMark}
                            handleMasteryChange={handleMasteryChange}
                        />
                    ))}
                        
                        
                    </tbody>
                </table>
            </div>
        </div>
     );
}
 
export default Category;