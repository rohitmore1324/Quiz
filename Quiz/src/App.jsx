import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Open from './component/Open';
import SignUp from './component/SignUp';
import Main from './component/Main';
import Login from './component/Login';
import Register from './component/Register';
import Profile from './component/Profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Open />} />
        <Route path="/home" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
