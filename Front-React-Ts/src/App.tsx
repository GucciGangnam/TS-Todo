import './App.css';
// Redux
import { useSelector } from "react-redux";
import { selectUser, clearUser } from "./redux/slices/userSlice.ts";
//RRD
import { Navigate, Route, Routes } from 'react-router-dom'; // Import Navigate
//Pages
import { LoginSignup } from './pages/loginsignup/LoginSignup.tsx';
import { Home } from './pages/home/Home.tsx';
import { List } from './pages/list/List.tsx';


// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector(selectUser);
  return user.authToken ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className='App'>

      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/list/:id" element={
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;