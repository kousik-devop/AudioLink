import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ArtistDashboard() {
  const navigate = useNavigate();

  const [musics, setMusics] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/music/artist-musics", {
        withCredentials: true,
      })
      .then((res) => {
        setMusics(
          res.data.musics.map((m) => ({
            id: m._id,
            title: m.title,
            artist: m.artist,
            coverImageUrl: m.coverImageUrl,
            musicUrl: m.musicUrl,
            plays: m.plays || 0,
            duration: m.duration || "3:00",
            released: m.released
              ? new Date(m.released).toISOString().split("T")[0]
              : "2024-01-01",
          }))
        );
      });

    axios
      .get("http://localhost:5002/api/music/playlist/artist", {
        withCredentials: true,
      })
      .then((res) => {
        setPlaylists(
          res.data.playlists.map((p) => ({
            id: p._id,
            title: p.title,
            artist: p.artist,
            followers: p.followers || 0,
            updated: p.updated
              ? `${Math.floor(
                  (Date.now() - new Date(p.updated)) /
                    (1000 * 60 * 60 * 24)
                )}d ago`
              : "N/A",
            musics: p.musics || [],
          }))
        );
      });
  }, []);

  const musicMap = Object.fromEntries(musics.map((m) => [m.id, m]));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Artist Dashboard</h1>
          <p className="text-gray-400">
            Overview of your content performance
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/artist/upload-music")}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium"
          >
            + New Track
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
            + New Playlist
          </button>
        </div>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Metric
          title="Total Plays"
          value={musics
            .reduce((a, t) => a + (t.plays || 0), 0)
            .toLocaleString()}
        />
        <Metric title="Musics" value={musics.length} />
        <Metric title="Playlists" value={playlists.length} />
        <Metric
          title="Followers"
          value={playlists
            .reduce((a, p) => a + (p.followers || 0), 0)
            .toLocaleString()}
        />
      </section>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Musics Table */}
        <section className="lg:col-span-2 bg-gray-900 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Musics</h2>
            <button className="text-sm text-gray-400 hover:text-white">
              Manage
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-2 text-left">Title</th>
                  <th>Plays</th>
                  <th>Duration</th>
                  <th>Released</th>
                </tr>
              </thead>
              <tbody>
                {musics.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-gray-800 hover:bg-gray-800"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.coverImageUrl}
                          alt=""
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <p className="font-medium">{m.title}</p>
                          <p className="text-gray-400 text-xs">{m.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{m.plays.toLocaleString()}</td>
                    <td className="text-center">{m.duration}</td>
                    <td className="text-center">{m.released}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Playlists */}
        <section className="bg-gray-900 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Playlists</h2>
            <button className="text-sm text-gray-400 hover:text-white">
              View All
            </button>
          </div>

          <ul className="space-y-4">
            {playlists.map((p) => {
              const resolvedMusics = p.musics
                .map((id) => musicMap[id])
                .filter(Boolean);

              return (
                <li
                  key={p.id}
                  className="bg-gray-800 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid grid-cols-2 gap-0.5 w-12 h-12">
                      {resolvedMusics.slice(0, 4).map((m) => (
                        <img
                          key={m.id}
                          src={m.coverImageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-gray-400">
                        Updated {p.updated}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{resolvedMusics.length} musics</span>
                    <span>{p.followers.toLocaleString()} followers</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
