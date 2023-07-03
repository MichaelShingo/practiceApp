import './Navbar.js';
import Navbar from './Navbar';
import Practice from './Practice';
import Login from './Login';
import SignUp from './SignUp';
import Register from './Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/practice" element={<Practice />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Routes>
        </div>
    </div>
    </Router>

  );
}

export default App;

// importing CSS at the top applies that css to every component and it's children
// otherwise you can use styled components or css modules
