import { FormEvent, useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { alertsApi } from '../api/client';
import { AlertItem } from '../types';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [threshold, setThreshold] = useState('2.5');
  const [velocity, setVelocity] = useState('0');
  const [status, setStatus] = useState('warning');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await alertsApi.list();
      setAlerts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await alertsApi.create(Number(threshold), Number(velocity), status);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save alert');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Alerts</h2>
          <p className="text-sm text-slate-500">Threshold management and alert history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Set threshold</h3>
          <form className="space-y-3" onSubmit={submit}>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Velocity threshold (m/s)</label>
              <input
                type="number"
                step="0.1"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-300"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Sample velocity (optional)</label>
              <input
                type="number"
                step="0.1"
                value={velocity}
                onChange={(e) => setVelocity(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-300"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-300"
              >
                <option value="normal">Normal</option>
                <option value="warning">Warning</option>
                <option value="danger">Danger</option>
              </select>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              className="w-full bg-sky-600 text-white rounded-md py-2 font-medium hover:bg-sky-700"
            >
              Save alert
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">History</h3>
            <span className="text-xs text-slate-500">Recent entries</span>
          </div>
          <DataTable
            columns={[
              { header: 'Triggered', accessor: (a) => new Date(a.triggeredAt).toLocaleString() },
              { header: 'Velocity', accessor: (a) => `${a.velocity} m/s` },
              { header: 'Threshold', accessor: (a) => `${a.threshold} m/s` },
              { header: 'Status', accessor: (a) => a.status }
            ]}
            rows={alerts}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
