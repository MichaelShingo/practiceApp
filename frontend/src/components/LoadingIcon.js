import fermata from '../icons/fermata.png';

const LoadingIcon = () => {
    return ( 
        <div className="loading-container">
            <div className="fermata-container">
                <img id="fermata" src={fermata}/>
                <div className="loading-circle" id="c1"></div>
                <div className="loading-circle" id="c2"></div>
                <div className="loading-circle" id="c3"></div>

            </div>
        </div>
     );
}
 
export default LoadingIcon;