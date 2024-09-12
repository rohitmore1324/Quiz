import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Open from './component/Open';
import SignUp from './component/SignUp';
import Login from './component/Login';
import Register from './component/Register';
import UserPage from './component/UserPage';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS
import AdminPage from './admin_panel/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Open />} />
        <Route path="/admin-page" element={<AdminPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-pages" element={<UserPage />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <ToastContainer /> {/* Add the ToastContainer here */}
    </Router>
  );
}

export default App;
