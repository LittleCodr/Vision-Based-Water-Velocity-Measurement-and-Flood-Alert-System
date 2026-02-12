import { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import { videoApi } from '../api/client';
import { VideoItem } from '../types';

const LiveFeedPage = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [active, setActive] = useState<VideoItem | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await videoApi.list();
      const list = res.data.data || [];
      setVideos(list);
      setActive(list[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      await videoApi.upload(file);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Live Feed</h2>
          <p className="text-sm text-slate-500">Manage video inputs and playback</p>
        </div>
        <span className="text-xs text-slate-400">// TODO: Camera stream integration</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-black aspect-video overflow-hidden">
          {active ? (
            <video src={active.url} controls className="w-full h-full object-contain bg-black" />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-200">No video selected</div>
          )}
        </div>
        <div className="space-y-4">
          <FileUpload label={uploading ? 'Uploading...' : 'Upload video (mp4/avi)'} accept="video/mp4,video/x-msvideo,video/avi" onChange={onUpload} />
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
            {videos.map((video) => (
              <button
                key={video.id}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 ${
                  active?.id === video.id ? 'bg-slate-100' : ''
                }`}
                onClick={() => setActive(video)}
              >
                <div className="font-medium text-slate-900">{video.name}</div>
                <div className="text-xs text-slate-500">{new Date(video.createdAt).toLocaleString()}</div>
              </button>
            ))}
            {videos.length === 0 && <p className="p-4 text-sm text-slate-500">No uploads yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeedPage;
