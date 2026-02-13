import { useState } from 'react';
import { analyzeVideo } from '../api/analysis';
import { alertsApi } from '../api/client';
import { VideoAnalysisResult } from '../types';
import FileUpload from './FileUpload';
import StatCard from './StatCard';

const riskTone: Record<VideoAnalysisResult['risk_level'], { label: string; className: string }> = {
  LOW: { label: 'LOW', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  MODERATE: { label: 'MODERATE', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  HIGH: { label: 'HIGH', className: 'bg-rose-100 text-rose-800 border-rose-200' }
};

const BackendAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Select a video first.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await analyzeVideo(selectedFile);
      setResult(response);
      const threshold = 2; // px/frame threshold matching backend risk logic
      if (response.risk_level === 'HIGH') {
        await alertsApi.create(threshold, response.average_velocity, 'danger');
      } else if (response.risk_level === 'MODERATE') {
        await alertsApi.create(threshold, response.average_velocity, 'warning');
      }
    } catch (err: any) {
      setError(err?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">AI Flood Analysis (FastAPI)</h3>
          <p className="text-sm text-slate-500">Upload a video or webcam capture; backend runs TensorFlow + optical flow</p>
        </div>
        {result && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${riskTone[result.risk_level].className}`}>
            Risk: {riskTone[result.risk_level].label}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1.6fr_1fr] items-center">
        <div className="space-y-2">
          <FileUpload
            label={selectedFile ? 'Change video' : 'Upload video (mp4/avi)'}
            accept="video/mp4,video/x-msvideo,video/avi"
            onChange={(file) => {
              setSelectedFile(file);
              setResult(null);
              setError('');
            }}
          />
          {selectedFile && <p className="text-xs text-slate-500">Selected: {selectedFile.name}</p>}
        </div>
        <div className="space-y-2">
          <button
            onClick={handleAnalyze}
            disabled={loading || !selectedFile}
            className="w-full rounded-md border-2 border-slate-900 bg-sky-200 text-slate-900 py-2 text-sm font-semibold hover:shadow-[4px_4px_0_#0f172a] disabled:opacity-50"
          >
            {loading ? 'Analyzing…' : 'Analyze via backend'}
          </button>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {!error && !loading && !result && (
            <p className="text-xs text-slate-500">Backend endpoint: {`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')}/analyze-video`}</p>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard title="Flood probability" value={`${(result.flood_probability * 100).toFixed(1)}%`} hint="TensorFlow model" />
          <StatCard
            title="Avg. velocity"
            value={`${result.average_velocity.toFixed(2)} px/frame`}
            hint="Lucas–Kanade optical flow"
          />
          <StatCard
            title="Risk level"
            value={result.risk_level}
            hint={result.risk_level === 'HIGH' ? 'Act now' : result.risk_level === 'MODERATE' ? 'Monitor closely' : 'Stable'}
            tone={result.risk_level === 'HIGH' ? 'danger' : result.risk_level === 'MODERATE' ? 'warning' : 'success'}
          />
        </div>
      )}
    </div>
  );
};

export default BackendAnalyzer;
