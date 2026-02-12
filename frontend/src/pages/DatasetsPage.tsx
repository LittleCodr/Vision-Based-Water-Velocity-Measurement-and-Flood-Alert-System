import { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import DataTable from '../components/DataTable';
import { datasetApi } from '../api/client';
import { DatasetItem } from '../types';

const DatasetsPage = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await datasetApi.list();
      setDatasets(res.data.data || []);
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
      await datasetApi.upload(file);
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
          <h2 className="text-2xl font-semibold text-slate-900">Datasets</h2>
          <p className="text-sm text-slate-500">Upload and manage training datasets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <FileUpload
            label={uploading ? 'Uploading...' : 'Upload CSV / ZIP / video'}
            accept=".csv,.zip,video/*"
            onChange={onUpload}
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Uploaded datasets</h3>
            <span className="text-xs text-slate-500">Stored in Firebase Storage</span>
          </div>
          <DataTable
            columns={[
              { header: 'Name', accessor: (d) => d.name },
              { header: 'Size', accessor: (d) => d.size ? `${(d.size / 1024 / 1024).toFixed(2)} MB` : 'n/a' },
              { header: 'Added', accessor: (d) => new Date(d.createdAt).toLocaleString() }
            ]}
            rows={datasets}
          />
        </div>
      </div>
    </div>
  );
};

export default DatasetsPage;
