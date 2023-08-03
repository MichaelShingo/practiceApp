const progressBar = ({ count, categoryCount, progressRef, progressPercent }) => {
    return ( 
        <div className="col-6 progress-container no-margin">
            <h2 className="fraction">{count}/{categoryCount}</h2>
            <div className="progress-bar-container">
                <div ref={progressRef} className="progress-bar" style={{width: progressPercent}}></div>
                <div className="progress-bar-back"></div>
            </div>
            
        </div>

     );
}
 
export default progressBar;