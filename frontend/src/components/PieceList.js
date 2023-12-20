import { ReactComponent as CheckMark } from '../svg/circle-check-solid.svg';
import { ReactComponent as PlusMark } from '../svg/circle-plus-solid.svg';
import { ReactComponent as OpenCircle } from '../svg/circle-regular.svg';
import { useRef, useState, useEffect, useContext } from 'react';
import {
  fetchMasteryUpdate,
  fetchRemovePiece,
  fetchAddPiece,
} from '../services/fetch.js';
import { useIsFirstRender } from '../services/firstRenderHook';
import { checkAuthenticated } from '../services/authService';
import Popup from './Popup.js';
import { ACTIONS, UserPieceLoadingContext } from '../Practice';

const PieceList = ({
  piece,
  updateCategoryCount,
  userPieces,
  pieceIDSet,
  setPieceIDSet,
  setUserPieces,
  filteredPieces,
  setPieceDetailPiece,
  setShowDetail,
  searchDispatch,
  searchState,
  setGlobalCompletion,
  updateGlobalMastery,
  setRefreshActive,
  updateCategoryMastery,
}) => {
  let initialMastery = '';
  if (checkAuthenticated()) {
    let initialMastery = userPieces
      .filter((userPiece) => userPiece.piece.id === piece.id)
      .map((filteredPiece) => filteredPiece.mastery_level);
  }

  if (isNaN(parseInt(initialMastery))) {
    initialMastery = '';
  }

  const checkMarkRef = useRef(null);
  const openCircle = useRef(null);
  const masteryLevel = useRef('');
  const prevMasteryNum = useRef(initialMastery);

  const firstMount = useRef(true);

  let renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;

  const currentUserPiece = userPieces.filter(
    (userPiece) => userPiece.piece.id === piece.id
  );

  const [masteryNum, setMasteryNum] = useState(
    currentUserPiece.length > 0 ? currentUserPiece[0].mastery_level : null
  );
  const [checked, setChecked] = useState(false);
  const [userPieceID, setUserPieceID] = useState(0);
  const [popupClass, setPopupClass] = useState('popup hide-popup');
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [runCount, setRunCount] = useState(0);
  const [updatingUserPiece, setUpdatingUserPiece] = useContext(
    UserPieceLoadingContext
  );

  useEffect(() => {
    // MOUNT AND UNMOUNT
    if (checkAuthenticated() && pieceIDSet.has(piece.id)) {
      // set user pieces, checked, mastery level
      updateCategoryMastery(masteryNum);
      // updateGlobalMastery(masteryNum);
      setChecked(true);
      setUserPieceID(
        userPieces
          .filter((userPiece) => userPiece.piece.id === piece.id)
          .map((filteredPiece) => filteredPiece.id)
      );
    } else {
      masteryLevel.current.disabled = true;
    }

    return () => {};
  }, []);

  const toggleShowDetail = () => {
    setPieceDetailPiece(piece);
    setShowDetail((prev) => !prev);
  };

  useEffect(() => {
    // when you filter....can you recalculate the masterySum?
    if (checked) {
      // console.log(`UPDATING CATEGORY MASTERY`)
      console.log('filtered pieces changed so set global mastery again!!!!');
      updateCategoryMastery(masteryNum);
      updateGlobalMastery(masteryNum);
      updateCategoryCount(true);
    }
  }, [filteredPieces]);

  const toggleCheckMark = async (e) => {
    masteryLevel.current.disabled = checked;
    setChecked(!checked);
    if (checkAuthenticated()) {
      if (!checked) {
        // add to database
        setGlobalCompletion((prev) => prev + 1); // GLOBAL
        setMasteryNum(10);

        updateCategoryMastery(10);
        updateGlobalMastery(10); // GLOBAL
        updateCategoryCount(!checked, 10);

        let updatedPieceIDSet = new Set(pieceIDSet);
        updatedPieceIDSet.add(piece.id);
        setPieceIDSet(updatedPieceIDSet);
        setUpdatingUserPiece(true);
        const jsonData = await fetchAddPiece(piece.id, 10);
        console.log('fetch add piece returned');
        setUserPieceID(jsonData.id);
        setUserPieces([...userPieces, jsonData]);
        setUpdatingUserPiece(false);
      } else {
        //remove from database
        setGlobalCompletion((prev) => prev - 1);
        updateCategoryCount(!checked, masteryNum);
        updateCategoryMastery(-1 * masteryNum);
        updateGlobalMastery(-1 * masteryNum);
        setMasteryNum(null);
        masteryLevel.current.value = 0;
        fetchRemovePiece(piece.id);
        setUserPieces(
          userPieces.filter((element) => element.piece.id !== piece.id)
        );
        let updatedPieceIDSet = new Set(pieceIDSet);
        updatedPieceIDSet.delete(piece.id);
        setPieceIDSet(updatedPieceIDSet);
      }

      // REFRESH ON ADD/REMOVE PIECE
      if (
        searchState.complete !== 'all' ||
        searchState.categorySort === 'completion' ||
        new Set(['mastery', 'date-updated', 'date-created']).has(
          searchState.sortBy
        )
      ) {
        setRefreshActive(true);
      }
    } else {
      // if not logged in
      setPopupPosition({ x: e.clientX, y: e.clientY });
      setPopupClass('popup show-popup');
      setTimeout(() => {
        setPopupClass('popup hide-popup');
      }, 1500);
    }
  };

  const generateMenu = () => {
    let res = [];
    for (let i = 0; i < 11; i++) {
      res.push(<option>{i}</option>);
    }
    return res;
  }

  useEffect(() => {
    if (masteryNum === null) {
      masteryLevel.current.style.backgroundColor = 'var(--color-grey-1)';
    } else if (masteryNum === '') {
    } else {
      // when you check an entry, update existing mastery, or fetch saved pieces
      const hue = mapColorRange(masteryNum, 1, 1, 10, 118);
      masteryLevel.current.style.backgroundColor = `hsl(${hue}, 100%, 38%)`;

      if (runCount === 0 && userPieceID === 0) {
        setRunCount((prevRunCount) => prevRunCount + 1);
      } else if (checked && userPieceID > 0) {
        // update mastery of already checked piece
        firstMount.current = false;
        fetchMasteryUpdate(userPieceID, masteryNum);

        let userPiecesCopy = [...userPieces];
        let pieceIndex = userPiecesCopy.findIndex(
          (element) => element.id === parseInt(userPieceID)
        );
        if (pieceIndex !== -1) {
          const updatedPiece = userPiecesCopy[pieceIndex];
          updatedPiece.mastery_level = masteryNum;
          userPiecesCopy[pieceIndex] = updatedPiece;
          setUserPieces(userPiecesCopy);
        }
      }
    }
    prevMasteryNum.current = masteryNum;
  }, [masteryNum]);

  const mapColorRange = (value, x1, y1, x2, y2) => {
    return ((y2 - y1) / (x2 - x1)) * value;
  };

  const handleMasteryChange = async () => {
    if (masteryLevel.current.value > 10 || masteryLevel.current.value == NaN) {
      setMasteryNum(10);
    } else if (masteryLevel.current.value < 0) {
      setMasteryNum(0);
    } else {
      setMasteryNum(masteryLevel.current.value);
      updateCategoryMastery(
        masteryLevel.current.value - prevMasteryNum.current
      );
      updateGlobalMastery(masteryLevel.current.value - prevMasteryNum.current);
    }
    if (new Set(['mastery', 'date-updated']).has(searchState.sortBy)) {
      setRefreshActive(true);
    }
    // TAKE UPDATE USERPIECES OBJECT
    const updatedUserPieces = userPieces.map((piece) => {
      return parseInt(piece.id) === parseInt(userPieceID)
        ? { ...piece, updated_at: new Date() }
        : piece;
    });

    setUserPieces(updatedUserPieces);
  };

  return (
    <tr className="piece-preview">
      <td className="title-col">{piece.title}</td>
      <td>
        <Popup
          popupClass={popupClass}
          position={popupPosition}
          message="Login first!"
        />
        {checked ? <CheckMark
          className={
            !checked ? 'complete-icon hide-checkmark' : 'complete-icon'
          }
          onClick={(e) => toggleCheckMark(e)}
          ref={checkMarkRef}
        />
        :
        <OpenCircle
          className={checked ? 'open-icon hide-checkmark' : 'open-icon'}
          style={{
            fill: updatingUserPiece
              ? 'var(--color-grey-0)'
              : 'var(--color-grey-2)',
            pointerEvents: updatingUserPiece ? 'none' : 'auto',
          }}
          onClick={(e) => toggleCheckMark(e)}
          ref={openCircle}
        />
        } 
      </td>
      <td>{piece.difficulty}</td>
      <td className="mastery-row">
        <select
          ref={masteryLevel}
          className="mastery-number"
          value={masteryNum}
          onChange={handleMasteryChange}
        >
            {generateMenu()}
         
        </select>

        {/* <input 
                    ref={masteryLevel}
                    className="mastery-number" 
                    type="number"  
                    min="0" 
                    max="10"
                    value={masteryNum}
                    onChange={handleMasteryChange}
                /> */}
      </td>
      <td>
        <PlusMark onClick={toggleShowDetail} className="plus-icon" />
      </td>
    </tr>
  );
};

export default PieceList;
