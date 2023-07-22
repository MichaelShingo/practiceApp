import React, { useEffect, useState } from 'react';

const List = ({ getItems }) => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        setItems(getItems(5));
        console.log('updating items');
    }, [getItems])
    return ( 
        items.map(item => <div key={item}>{item}</div>)
     );
}
 
export default List;


// import { ACTIONS } from '../Social.js'

// const Todo = ({todo, dispatch}) => {
//     return ( 
//         <div>
//             <span style={{ color: todo.complete ? '#AAA' : '#000'}}>
//                 {todo.name}
//             </span>
//             <button onClick={() => dispatch({ type: ACTIONS.TOGGLE_TODO,
//             payload: { id: todo.id }})}>Toggle</button>
//             <button onClick={() => dispatch({ type: ACTIONS.DELETE_TODO,
//             payload: { id: todo.id }})}>Delete</button>
//         </div>
//      );
// }
 
// export default Todo;