import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function MusicPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [track, setTrack] = useState(null)

  const audioRef = useRef(null)
  const animationRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [playbackRate, setPlaybackRate] = useState(1)

  const formatTime = useCallback((s) => {
    if (!Number.isFinite(s)) return '0:00'
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }, [])

  function handleLoadedMetadata() {
    setDuration(audioRef.current.duration)
    animationRef.current = requestAnimationFrame(whilePlaying)
  }

  function whilePlaying() {
    setCurrentTime(audioRef.current.currentTime)
    animationRef.current = requestAnimationFrame(whilePlaying)
  }

  function togglePlay() {
    if (isPlaying) {
      audioRef.current.pause()
      cancelAnimationFrame(animationRef.current)
    } else {
      audioRef.current.play()
      animationRef.current = requestAnimationFrame(whilePlaying)
    }
    setIsPlaying(!isPlaying)
  }

  function skip(sec) {
    audioRef.current.currentTime = Math.min(
      Math.max(0, audioRef.current.currentTime + sec),
      duration
    )
  }

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/music/get-details/${id}`, { withCredentials: true })
      .then(res => setTrack(res.data.music))
      .catch(() => navigate('/'))
  }, [id, navigate])

  useEffect(() => () => cancelAnimationFrame(animationRef.current), [])

  if (!track) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-4">
      
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          Back
        </button>
        <h1 className="text-lg font-semibold truncate">{track.title}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        <div className="flex justify-center">
          <img
            src={track.coverImageUrl}
            alt="cover"
            className="w-64 h-64 md:w-80 md:h-80 rounded-xl shadow-lg object-cover"
          />
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col gap-6">
          
          <div>
            <h2 className="text-xl font-bold">{track.title}</h2>
            <p className="text-zinc-400">{track.artist}</p>
          </div>

          <audio
            ref={audioRef}
            src={track.musicUrl}
            autoPlay
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-2 text-sm">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={e => {
                audioRef.current.currentTime = e.target.value
                setCurrentTime(e.target.value)
              }}
              className="flex-1 accent-green-500"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex justify-center items-center gap-6">
            <button onClick={() => skip(-10)} className="text-sm px-3 py-1 bg-zinc-800 rounded">
              -10s
            </button>

            <button
              onClick={togglePlay}
              className="px-6 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button onClick={() => skip(10)} className="text-sm px-3 py-1 bg-zinc-800 rounded">
              +10s
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Volume {Math.round(volume * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => {
                  setVolume(e.target.value)
                  audioRef.current.volume = e.target.value
                }}
                className="w-full accent-green-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Speed {playbackRate}x</label>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.25}
                value={playbackRate}
                onChange={e => {
                  setPlaybackRate(e.target.value)
                  audioRef.current.playbackRate = e.target.value
                }}
                className="w-full accent-green-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
