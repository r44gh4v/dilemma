import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingProvider } from './contexts/LoadingContext.jsx';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Feed = lazy(() => import('./pages/Feed.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Post = lazy(() => import('./pages/Post.jsx'));
const MyDilemmas = lazy(() => import('./pages/MyDilemmas.jsx'));
const DilemmaView = lazy(() => import('./pages/DilemmaView.jsx'));

function App() {
  return (
    <LoadingProvider>
      <Router>
        <Header />
        <GlobalLoadingOverlay />
        <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post" element={<ProtectedRoute><Post /></ProtectedRoute>} />
            <Route path="/my-dilemmas" element={<ProtectedRoute><MyDilemmas /></ProtectedRoute>} />
            <Route path="/dilemma/:id" element={<DilemmaView />} />
          </Routes>
        </Suspense>
      </Router>
    </LoadingProvider>
  );
}

export default App;