import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Chat } from './pages/Chat';
import { CallProvider } from './contexts/CallContext';
import { CallView } from './components/CallView';
import { CallNotification } from './components/CallNotification';
import { useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <CallProvider currentUser={user}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <>
                <Chat />
                <CallView />
                <CallNotification />
              </>
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CallProvider>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;