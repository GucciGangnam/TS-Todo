import './App.css';
import { useSelector } from "react-redux";
import { selectUser, clearUser } from "./redux/slices/userSlice";
import { persistor } from "./redux/store.ts";
import { useDispatch } from 'react-redux';

import { Navigate, Route, Routes } from 'react-router-dom'; // Import Navigate

import { LoginSignup } from './loginsignup/LoginSignup.tsx';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  console.log(user)

  const handleLogout = () => {
    dispatch(clearUser()); // Clear Redux state
    persistor.purge(); // Clears persisted state in localStorage
  };

  return (
    <div className='App'>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        {/* <Route path="/" element={<Home/>}/> */}
      </Routes>
    </div>
  );
}

export default App;