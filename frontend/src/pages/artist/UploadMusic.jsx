import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UploadMusic() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    coverImage: null,
    music: null,
  });

  const [coverPreview, setCoverPreview] = useState(null);
  const [musicPreview, setMusicPreview] = useState(null);
  const [musicDuration, setMusicDuration] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (form.coverImage) {
      const url = URL.createObjectURL(form.coverImage);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setCoverPreview(null);
  }, [form.coverImage]);

  useEffect(() => {
    if (form.music) {
      const url = URL.createObjectURL(form.music);
      setMusicPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setMusicPreview(null);
    setMusicDuration(null);
  }, [form.music]);

  function handleAudioLoaded() {
    if (audioRef.current?.duration) {
      const d = audioRef.current.duration;
      const mins = Math.floor(d / 60);
      const secs = Math.round(d % 60).toString().padStart(2, "0");
      setMusicDuration(`${mins}:${secs}`);
    }
  }

  function handleChange(e) {
    const { name, files, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  }

  function removeFile(kind) {
    setForm((f) => ({ ...f, [kind]: null }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    if (form.coverImage) formData.append("coverImage", form.coverImage);
    if (form.music) formData.append("music", form.music);

    axios
      .post("http://localhost:5002/api/music/upload", formData, {
        withCredentials: true,
      })
      .then(() => navigate("/artist/dashboard"));
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Upload Music</h1>
        <p className="text-gray-400">Add a new track to your catalog</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-xl p-4 md:p-6 space-y-6 max-w-4xl"
      >
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Song title"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-400
                file:bg-gray-800 file:border-0
                file:px-4 file:py-2 file:rounded-lg
                file:text-gray-200 hover:file:bg-gray-700"
            />
          </div>

          {/* Music */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Music File</label>
            <input
              type="file"
              name="music"
              accept="audio/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-400
                file:bg-gray-800 file:border-0
                file:px-4 file:py-2 file:rounded-lg
                file:text-gray-200 hover:file:bg-gray-700"
            />
          </div>
        </div>

        {/* Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cover Preview */}
          {coverPreview && (
            <div className="bg-gray-800 rounded-lg p-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Cover Image</span>
                <button
                  type="button"
                  onClick={() => removeFile("coverImage")}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="text-xs text-gray-400 flex justify-between">
                <span>{form.coverImage.name}</span>
                <span>{(form.coverImage.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}

          {/* Audio Preview */}
          {musicPreview && (
            <div className="bg-gray-800 rounded-lg p-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Audio</span>
                <button
                  type="button"
                  onClick={() => removeFile("music")}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              <audio
                ref={audioRef}
                controls
                src={musicPreview}
                onLoadedMetadata={handleAudioLoaded}
                className="w-full"
              />
              <div className="text-xs text-gray-400 flex flex-wrap gap-2">
                <span>{form.music.name}</span>
                <span>{(form.music.size / 1024).toFixed(1)} KB</span>
                {musicDuration && <span>Duration: {musicDuration}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-medium px-6 py-2 rounded-lg"
          >
            Upload
          </button>
          <button
            type="reset"
            onClick={() =>
              setForm({ title: "", coverImage: null, music: null })
            }
            className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
