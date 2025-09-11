'use client';

import { useState, useEffect } from 'react';

interface ActiveUsersData {
  id: number;
  timestamp: string;
  total_active_users: number;
  by_country: string;
  by_device: string;
  by_platform: string;
  location_details: string;
  raw_data: string;
}

interface LocationHistoryData {
  id: number;
  timestamp: string;
  country: string;
  city: string;
  active_users: number;
  collection_id: number;
  collection_total?: number;
}

type DataType = ActiveUsersData | LocationHistoryData;

export default function SQLiteViewer() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(100);
  const [table, setTable] = useState<'active_users' | 'location_history'>('active_users');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [limit, table]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/sqlite-data?limit=${limit}&table=${table}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const renderActiveUsersTable = () => (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-black text-white">
          <th className="border-2 border-black px-4 py-2 text-left text-lg">ID</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">Timestamp</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">Total Active Users</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">Location Count</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">By Country</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">By Device</th>
        </tr>
      </thead>
      <tbody>
        {(data as ActiveUsersData[]).map((row) => {
          const locationDetails = row.location_details ? JSON.parse(row.location_details) : [];
          const byCountry = row.by_country ? JSON.parse(row.by_country) : {};
          const byDevice = row.by_device ? JSON.parse(row.by_device) : {};
          
          return (
            <tr key={row.id} className="hover:bg-gray-100">
              <td className="border border-black px-4 py-2 text-base text-black">{row.id}</td>
              <td className="border border-black px-4 py-2 text-base text-black">
                {new Date(row.timestamp).toLocaleString('ko-KR')}
              </td>
              <td className="border border-black px-4 py-2 text-base font-bold text-black">
                {row.total_active_users}
              </td>
              <td className="border border-black px-4 py-2 text-base text-black">
                {Array.isArray(locationDetails) ? locationDetails.length : 0}
              </td>
              <td className="border border-black px-4 py-2 text-base text-black">
                {Object.entries(byCountry).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ')}
              </td>
              <td className="border border-black px-4 py-2 text-base text-black">
                {Object.entries(byDevice).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ')}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderLocationHistoryTable = () => (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-black text-white">
          <th className="border-2 border-black px-4 py-2 text-left text-lg">ID</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">Timestamp</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">Country</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">City</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">Active Users</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">Collection ID</th>
          <th className="border-2 border-black px-4 py-2 text-left text-lg">Collection Total</th>
        </tr>
      </thead>
      <tbody>
        {(data as LocationHistoryData[]).map((row) => (
          <tr key={row.id} className="hover:bg-gray-100">
            <td className="border border-black px-4 py-2 text-base text-black">{row.id}</td>
            <td className="border border-black px-4 py-2 text-base text-black">
              {new Date(row.timestamp).toLocaleString('ko-KR')}
            </td>
            <td className="border border-black px-4 py-2 text-base text-black">{row.country}</td>
            <td className="border border-black px-4 py-2 text-base text-black">{row.city}</td>
            <td className="border border-black px-4 py-2 text-base font-bold text-black">
              {row.active_users}
            </td>
            <td className="border border-black px-4 py-2 text-base text-black">{row.collection_id}</td>
            <td className="border border-black px-4 py-2 text-base text-black">
              {row.collection_total || '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">SQLite Database Viewer</h1>
        
        <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <label className="text-lg font-medium text-black">Table:</label>
            <select 
              value={table} 
              onChange={(e) => setTable(e.target.value as 'active_users' | 'location_history')}
              className="px-4 py-2 border-2 border-black rounded-lg text-lg text-black bg-white"
            >
              <option value="active_users">Active Users</option>
              <option value="location_history">Location History</option>
            </select>
            
            <label className="text-lg font-medium ml-4 text-black">Rows:</label>
            <select 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-4 py-2 border-2 border-black rounded-lg text-lg text-black bg-white"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
            
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-lg ml-auto"
            >
              Refresh
            </button>
          </div>

          {loading && <p className="text-xl text-black">Loading...</p>}
          {error && <p className="text-xl text-red-600">Error: {error}</p>}
          
          {!loading && !error && (
            <div>
              <p className="text-lg mb-4 text-black font-medium">
                Showing {data.length} of {total} total records in {table.replace('_', ' ')} table
              </p>
              <div className="overflow-x-auto">
                {table === 'active_users' ? renderActiveUsersTable() : renderLocationHistoryTable()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}