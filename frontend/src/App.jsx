import { Routes, Route, Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ArtistDashboard from './pages/artist/ArtistDashboard'
import UploadMusic from './pages/artist/UploadMusic'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import MusicPlayer from './pages/music/MusicPlayer'
import { io } from 'socket.io-client'


function App() {

  const [ socket, setSocket ] = useState(null)

  useEffect(() => {

    const newSocket = io("localhost:5002", {
      withCredentials: true,
    })

    setSocket(newSocket);

    newSocket.on("play", (data) => {
      const musicId = data.musicId
      window.location.href = `/music/${musicId}`
    })

  }, [])

  return (
    <div>
      <main>
        <Routes>

          {/* Public */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/music/:id"
            element={
              <ProtectedRoute allowedRole="user">
                <MusicPlayer />
              </ProtectedRoute>
            }
          />

          {/* User */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRole="user">
                <Home socket={socket} />
              </ProtectedRoute>
            }
          />

          {/* Artist */}
          <Route
            path="/artist/dashboard"
            element={
              <ProtectedRoute allowedRole="artist">
                <ArtistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artist/upload-music"
            element={
              <ProtectedRoute allowedRole="artist">
                <UploadMusic />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
    </div>

  )
}

export default App