import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Brainrot from "./Components/Brainrot";
import Home from './Pages/Home';
import Workout from './Pages/Workout';
import { clearActiveWorkout } from './utils/workoutStorage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav >
          <NavLink 
            to="/"
            onClick={clearActiveWorkout}>
            Home
          </NavLink>
          <NavLink 
            to="/login" 

          >
            Login
          </NavLink>
          <NavLink 
            to="/signup" 
          >
            Signup
          </NavLink>
          <NavLink 
            to="/brainrot" 
          >
            Brainrot
          </NavLink>
        </nav>

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/brainrot" element={<Brainrot />} />
            <Route path="/workout/new" element={<Workout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
