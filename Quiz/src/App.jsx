import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Open from './component/Open';
import SignUp from './component/SignUp';
import Main from './component/Main';
import Login from './component/Login';
import Register from './component/Register';
import Profile from './component/Profile';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

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
      <ToastContainer /> {/* Add the ToastContainer here */}
    </Router>
  );
}

export default App;
