import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

export default function Home({ socket }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [musics, setMusics] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/music", { withCredentials: true })
      .then((res) => {
        setMusics(
          res.data.musics.map((m) => ({
            id: m._id,
            title: m.title,
            artist: m.artist,
            coverImageUrl: m.coverImageUrl,
            musicUrl: m.musicUrl,
          }))
        );
      });

    axios
      .get("http://localhost:5002/api/music/playlist", {
        withCredentials: true,
      })
      .then((res) => {
        setPlaylists(
          res.data.playlists.map((p) => ({
            id: p._id,
            title: p.title,
            count: p.musics.length,
          }))
        );
      });
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 md:px-8 py-6 space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Discover</h1>
          <p className="text-gray-400 mt-1">
            Trending playlists and new releases
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-red-600 border border-gray-700 hover:border-red-500 text-gray-200 hover:text-white px-4 py-2 rounded-lg transition text-sm"
        >
          Logout
        </button>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Playlists</h2>
          <button className="text-sm text-gray-400 hover:text-white">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists.map((p) => (
            <div
              key={p.id}
              tabIndex={0}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl p-4 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <h3 className="font-semibold truncate">{p.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {p.count} tracks
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Musics</h2>
          <button className="text-sm text-gray-400 hover:text-white">
            Explore
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {musics.map((m) => (
            <div
              key={m.id}
              tabIndex={0}
              onClick={() => {
                socket?.emit("play", { musicId: m.id });
                navigate(`/music/${m.id}`);
              }}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl p-3 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={m.coverImageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-3">
                <h3 className="font-medium truncate">{m.title}</h3>
                <p className="text-sm text-gray-400 truncate">
                  {m.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
