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
import { Line } from 'react-chartjs-2';

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

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await fetch('/api/analytics/user-metrics/chart-data');
      const result = await response.json();
      
      if (result.success && result.data) {
        // Sample data to show monthly averages for better visualization
        const monthlyData = sampleMonthlyData(result.data);
        setChartData(monthlyData);
        setDateRange(result.dateRange);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sampleMonthlyData = (data: any) => {
    const labels = [];
    const totalUsers = [];
    const newUsers = [];
    const returningUsers = [];
    
    // Sample every 60 days for better visibility from distance
    for (let i = 0; i < data.labels.length; i += 60) {
      const dateStr = data.labels[i];
      if (dateStr) {
        const date = new Date(dateStr);
        const monthYear = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
        labels.push(monthYear);
        totalUsers.push(data.datasets[0].data[i]);
        newUsers.push(data.datasets[1].data[i]);
        returningUsers.push(data.datasets[2].data[i]);
      }
    }
    
    return {
      labels,
      datasets: [
        {
          label: '전체 사용자',
          data: totalUsers,
          borderColor: '#FF0000',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          borderWidth: 10,
          tension: 0, // Straight lines
          pointRadius: 10,
          pointBackgroundColor: '#FF0000',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 3,
          pointHoverRadius: 15,
        },
        {
          label: '신규 사용자',
          data: newUsers,
          borderColor: '#0066FF',
          backgroundColor: 'rgba(0, 102, 255, 0.2)',
          borderWidth: 8,
          tension: 0, // Straight lines
          pointRadius: 8,
          pointBackgroundColor: '#0066FF',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 3,
          pointHoverRadius: 12,
        },
        {
          label: '재방문 사용자',
          data: returningUsers,
          borderColor: '#00CC00',
          backgroundColor: 'rgba(0, 204, 0, 0.2)',
          borderWidth: 8,
          tension: 0, // Straight lines
          pointRadius: 8,
          pointBackgroundColor: '#00CC00',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 3,
          pointHoverRadius: 12,
        }
      ]
    };
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
          color: '#000000',
          usePointStyle: true,
          pointStyle: 'rectRounded',
          boxWidth: 30,
          boxHeight: 30
        }
      },
      title: {
        display: true,
        text: '지난 2년간 사용자 통계',
        font: {
          size: 64,
          weight: 'bold'
        },
        color: '#000000',
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
          color: 'rgba(0, 0, 0, 0.3)',
          lineWidth: 3
        },
        ticks: {
          font: {
            size: 24,
            weight: 'bold'
          },
          color: '#000000',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12
        },
        border: {
          color: '#000000',
          width: 5
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.2)',
          lineWidth: 2
        },
        ticks: {
          font: {
            size: 28,
            weight: 'bold'
          },
          color: '#000000',
          callback: function(value) {
            return value.toLocaleString('ko-KR');
          }
        },
        border: {
          color: '#000000',
          width: 5
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
      <div className="flex items-center justify-center h-full">
        <div className="text-4xl font-bold">차트 로딩 중...</div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-4xl font-bold text-gray-500">데이터 없음</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div style={{ height: '950px' }}>
        <Line options={options} data={chartData} />
      </div>
      {dateRange && (
        <div className="text-center mt-2 text-3xl font-bold text-black">
          기간: {dateRange.start} ~ {dateRange.end}
        </div>
      )}
    </div>
  );
}