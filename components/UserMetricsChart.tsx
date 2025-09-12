'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import dynamic from 'next/dynamic';

const AnimatedLineChart = dynamic(() => import('./AnimatedLineChart'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-4xl font-bold text-white">차트 로딩 중...</div></div>
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function UserMetricsChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{start: string, end: string} | null>(null);
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    fetchChartData();
  }, []);

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);
      if (months > 0) {
        return `${years}년 ${months}개월`;
      }
      return `${years}년`;
    } else if (diffDays >= 30) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      if (remainingDays > 0) {
        return `${months}개월 ${remainingDays}일`;
      }
      return `${months}개월`;
    } else {
      return `${diffDays}일`;
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch('/api/analytics/user-metrics/chart-data');
      const result = await response.json();
      
      console.log('Chart data received:', result);
      
      if (result.success && result.data) {
        // Use daily data directly without sampling
        setChartData(result.data);
        setDateRange(result.dateRange);
        if (result.dateRange) {
          setDuration(calculateDuration(result.dateRange.start, result.dateRange.end));
        }
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };


  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 36,
            weight: 'bold'
          },
          padding: 40,
          color: '#FFFFFF',
          usePointStyle: true,
          pointStyle: 'rectRounded',
          boxWidth: 30,
          boxHeight: 30
        }
      },
      title: {
        display: true,
        text: '지난 1년간 사용자 통계',
        font: {
          size: 64,
          weight: 'bold'
        },
        color: '#FFFFFF',
        padding: 20
      },
      tooltip: {
        titleFont: {
          size: 20,
          weight: 'bold'
        },
        bodyFont: {
          size: 18
        },
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        displayColors: true,
        boxWidth: 20,
        boxHeight: 20
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 16,
            weight: 'bold'
          },
          color: '#FFFFFF',
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 30
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 28,
            weight: 'bold'
          },
          color: '#FFFFFF',
          callback: function(value) {
            return value.toLocaleString('ko-KR');
          }
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="text-4xl font-bold text-white animate-pulse">차트 로딩 중...</div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="text-4xl font-bold text-gray-400">데이터 없음</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Grid background overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="chart-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chart-grid)" />
        </svg>
      </div>
      
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 p-8">
          {!loading && chartData ? (
            <AnimatedLineChart options={options} data={chartData} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-4xl font-bold text-white animate-pulse">차트 로딩 중...</div>
            </div>
          )}
        </div>
        {dateRange && (
          <div className="text-center pb-6">
            <div className="text-4xl font-bold text-white">
              {dateRange.start} ~ {dateRange.end}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}