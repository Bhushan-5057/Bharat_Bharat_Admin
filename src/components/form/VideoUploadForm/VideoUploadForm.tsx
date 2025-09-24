"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { addVideo, updateVideo, getVideos } from "@/store/redux/slice/videoSlice";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";

interface VideoUploadFormProps {
  initialVideo?: {
    id: string;
    youtube_url: string;
    description: string;
  };
  mode?: "add" | "edit";
  onSuccess?: () => void;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  initialVideo,
  mode = "add",
  onSuccess,
}) => {
  const [videoUrl, setVideoUrl] = useState(initialVideo?.youtube_url || "");
  const [description, setDescription] = useState(initialVideo?.description || "");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (initialVideo) {
      setVideoUrl(initialVideo.youtube_url);
      setDescription(initialVideo.description);
    }
  }, [initialVideo]);

  const isValidYouTubeUrl = (url: string): boolean => {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+/;
    return regex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!videoUrl.trim()) {
      setUrlError("Please provide a video URL");
      hasError = true;
    } else if (!isValidYouTubeUrl(videoUrl)) {
      setUrlError("Please enter a valid YouTube video URL");
      hasError = true;
    } else {
      setUrlError(null);
    }

    if (!description.trim()) {
      setDescError("Please provide a description");
      hasError = true;
    } else {
      setDescError(null);
    }

    if (hasError) return;

    setLoading(true);

    try {
      if (mode === "add") {
        const resultAction = await dispatch(
          addVideo({ payload: { youtube_url: videoUrl, description } })
        );
        if (addVideo.fulfilled.match(resultAction)) {
          showSuccess(MESSAGES.ADD_SUCCESS || "Video added successfully");
        } else {
          showError((resultAction.payload as string) || "Failed to add video");
        }
      } else if (mode === "edit" && initialVideo) {
        const resultAction = await dispatch(
          updateVideo({ id: initialVideo.id, youtube_url: videoUrl, description })
        );
        if (updateVideo.fulfilled.match(resultAction)) {
          showSuccess(MESSAGES.EDIT_SUCCESS || "Video updated successfully");
        } else {
          showError((resultAction.payload as string) || "Failed to update video");
        }
      }

      dispatch(getVideos());
      onSuccess?.();
    } catch (err) {
      console.error("Video save failed", err);
      showError("Failed to save video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-lg p-6 space-y-6"
    >
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">
          YouTube Video URL
        </label>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste YouTube URL here"
          className={`p-3 border rounded-md focus:outline-none focus:ring-2 ${
            urlError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          } dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200`}
        />
        {urlError && <p className="text-red-500 text-sm mt-2">{urlError}</p>}
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write video description"
          rows={4}
          className={`p-3 border rounded-md focus:outline-none focus:ring-2 ${
            descError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          } dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200`}
        />
        {descError && <p className="text-red-500 text-sm mt-2">{descError}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-md"
      >
        {loading ? "Saving..." : mode === "edit" ? "Update Video" : "Save Video"}
      </button>
    </form>
  );
};
