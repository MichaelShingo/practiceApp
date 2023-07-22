import { useState, useDeferredValue, useMemo, useTransition, useLayoutEffect, useEffect, useCallback, useRef, useContext, useReducer} from 'react';
import { ThemeContext } from './App'
import { useTheme, useThemeUpdate} from './components/ThemeContext';
import List from './components/Todo';
import { useLocalStorage } from './components/useLocalStorage';
import { useUpdateLogger } from './components/useUpdateLogger';




const Social = ({funcNav, input}) => {
    funcNav(false);

    const LIST_SIZE = 20000;
    const deferredInput = useDeferredValue(input)
    const list = useMemo(() => {
        const l = []
        for (let i = 0; i < LIST_SIZE; i++) {
            l.push(<div key={i}>{input}</div>)
        }
        return l
    }, [input])

    return list

}




// const Social = ({funcNav}) => {
//     funcNav(false);

//     const [isPending, startTransition] = useTransition();
//     const [ input, setInput ] = useState('');
//     const [list, setList] = useState([]);

//     const LIST_SIZE = 20000;

//     const handleChange = (e) => {
//         setInput(e.target.value); // by default high priority
//         const l = []
//         startTransition(() => { // this code is lower priority
            
//             for (let i = 0; i < LIST_SIZE; i++) {
//                 l.push(e.target.value)
//             }
//             setList(l)
//         })
//     }

//     return (
//         <div>
//             <input type="text" value={input} onChange={handleChange} />
//             {isPending 
//             ? "Loading...."
//             : list.map((item, index) => {
//                 return <div key={index}>{item}</div>
//             })}
//         </div>
//     )

// }





// const Social = ({funcNav}) => {
//     funcNav(false);

//     const [name, setName] = useLocalStorage('name', '');
//     useUpdateLogger(name);
    
//     return (
//         <div>
//             <input
//                 type="text"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//             />
             
//         </div>
//     )

// }





// const Social = ({funcNav}) => {
//     funcNav(false);
//     const [number, setNumber] = useState(1);
//     const [dark, setDark] = useState(false);

//     const getItems = useCallback((incrementor) => {
//         return [number + incrementor, number + incrementor * 2, number + incrementor * 3];
//     }, [number]) // useCallback prevents this from running every time the component renders
//     // useMemo returns the return value of the function, for repetitive slow functions
//     // useCallback returns the function itself, meaning you can pass in parameters
//     // this way you don't CREATE the function in a new reference every time the component rerenders

//     const theme = {
//         backgroundColor: dark? '#333' : '#FFF',
//         color: dark ? '#FFF' : '#333'
//     }

//     return (
//         <div>
//             <div style={theme}>
//                 <input
//                     type="number"
//                     value={number}
//                     onChange={e => setNumber(parseInt(e.target.value))}
//                 />
//                 <button onClick={() => setDark(prevDark => !prevDark)}>
//                     Toggle theme
//                 </button>
//                 <List getItems={getItems}/>
//             </div>
//         </div>
//     )

// }



// export const ACTIONS = {
//     ADD_TODO: 'add-todo',
//     TOGGLE_TODO: 'toggle-todo',
//     DELETE_TODO: 'delete-todo',
// }   

// const reducer = (todos, action) => {
//     switch (action.type) {
//         case ACTIONS.ADD_TODO:
//             return [...todos, newTodo(action.payload.name)]
//         case ACTIONS.TOGGLE_TODO:
//             return todos.map(todo => {
//                 if (todo.id === action.payload.id) {
//                     return { ...todo, complete: !todo.complete }
//                 }
//                 return todo
//             })
//         case ACTIONS.DELETE_TODO:
//             return todos.filter(todo => todo.id !== action.payload.id)
//         default:
//             return todos
//     }
// }

// const newTodo = (name) => {
//     return { id: Date.now(), name: name, complete: false }
// }

// const Social = ({funcNav}) => {
//     const [todos, dispatch] = useReducer(reducer, []) // returns state and a function, dispatch
//     const [name, setName] = useState('');
//     funcNav(false);

//     console.log(todos);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch( {type: ACTIONS.ADD_TODO, payload: { name: name } }) // payload gives access to local variables
//         setName('');
//     }

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" value={name} onChange={ e => setName(e.target.value)}/>

//             </form>
//             {todos.map(todo => {
//                 return <Todo key={todo.id} dispatch={dispatch} todo={todo} />
//             })}
//         </div>
//     )

// }




// const ACTIONS = {
//     INCREMENT: 'increment',
//     DECREMENT: 'decrement'
// }
// const reducer = (state, action) => {
//     // takes current state and action
//     // returns updated state
//     switch (action.type) {
//         case ACTIONS.INCREMENT:
//             return { count: state.count + 1}
//         case ACTIONS.DECREMENT:
//             return { count: state.count - 1} 
//         default:
//             return state
//     }
    
// }

// const Social = ({funcNav}) => {
//     const [state, dispatch] = useReducer(reducer, { count: 0 }) // returns state and a function, dispatch
//     funcNav(false);

//     const increment = () => {
//         dispatch({ type: ACTIONS.INCREMENT })
//     }

//     const decrement = () => {
//         dispatch({ type: ACTIONS.DECREMENT })
//     }
    


//     return (
//         <div>
//             <button onClick={decrement}>-</button>
//             <span>{state.count}</span>
//             <div onClick={increment}>+</div>
//         </div>
//     )

// }

export default Social;



// const Social = ({funcNav}) => {
//     funcNav(false);

//     const darkTheme = useTheme();
//     const toggleTheme = useThemeUpdate();

//     const themeStyles = {
//         backgroundColor: darkTheme ? '#333' : '#CCC',
//         color: darkTheme ? '#ccc' : '#333',
//         padding: '2rem',
//         margin: '2rem'
//     }
    


//     return (
//         <div>
//             <button onClick={toggleTheme}>toggle</button>
//             <div style={themeStyles}>Function Theme</div>
//         </div>
//     )

// }

// export default Social;





// const Social = ({funcNav}) => {
//     funcNav(false);
//     // refs persist value between rerenders, but it does not cause the component to rerender
//     // avoids infinite loop
//     // also useful for saving previous value of state

//     const [name, setName] = useState('');
//     const renderCount = useRef(0);
//     const inputRef = useRef();

//     useEffect(() => {
//         renderCount.current = renderCount.current + 1;
//     })

//     const focus = () => {
//         inputRef.current.focus();
//     }
//     return (
//         <div>
//             <input ref={inputRef} value={name} onChange={e => setName(e.target.value)}/>
//             <div>My name is {name}</div>
//             <div>I rendered {renderCount.current} times</div>
//             <button onClick={focus}>Focus</button>
//         </div>
//     )

// }

// export default Social;



// import { useState, useMemo, useEffect} from 'react';

// const Social = ({funcNav}) => {
//     funcNav(false);
//     const [number, setNumber] = useState(0);
//     const [dark, setDark] = useState(false);
//     const doubleNumber = useMemo(() => { // only runs function when "number" changes
//         return slowFunction(number); // useMemo when the function is extremely slow
//     }, [number])

//     const themeStyles = useMemo(() => { // when you render, javascript creates a new object for the theme
//         // wrap the object with useMemo when you want to check equality of the objects between renders
//         return {
//             backgroundColor: dark ? 'black' : 'white',
//             color: dark ? 'white' : 'black'
//         }
//     }, [dark])

//     useEffect(() => {
//         console.log('theme changed');
//     }, [themeStyles])

//     return (
//         <div>
//             <input type="number" value={number} onChange={e => setNumber(parseInt(e.target.value))}/>
//             <button onClick={() => setDark(prevDark => !prevDark)}>Change Theme</button>
//             <div style={themeStyles}>{doubleNumber}</div>
//         </div>
//     )

// }

// function slowFunction(num) {
//     console.log('Calling');
//     for (let i = 0; i <= 1000000000; i++) {}
//     return num * 2;
// }

// export default Social;


// import { useState, useEffect } from 'react';
// const Social = ({funcNav}) => {
//     funcNav(false);
//     const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
//     useEffect(() => {
//         window.addEventListener('resize', handleResize);

//         return () => {
//             console.log('remove')
//             window.removeEventListener('resize', handleResize);
//         }
//     }, [windowWidth])

//     const handleResize = () => {
//         setWindowWidth(window.innerWidth);
//     }


//     return ( 
//         <div>
//             {windowWidth}
//         </div>
//      );
// }
 
// export default Social;