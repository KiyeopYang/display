'use client';

import { useEffect, useRef, useState } from 'react';
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

interface AnimatedLineChartProps {
  data: any;
  options: ChartOptions<'line'>;
}

export default function AnimatedLineChart({ data, options }: AnimatedLineChartProps) {
  const [showChart, setShowChart] = useState(false);
  
  useEffect(() => {
    // Simple fade-in after mount
    const timer = setTimeout(() => {
      setShowChart(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Enhanced options with simple fade animation only
  const customOptions: ChartOptions<'line'> = {
    ...options,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    }
  };
  
  if (!data || !data.datasets || data.datasets.length === 0) {
    return <div className="flex items-center justify-center h-full text-white text-2xl">차트 데이터 로딩 중...</div>;
  }
  
  return (
    <div style={{ 
      opacity: showChart ? 1 : 0, 
      transition: 'opacity 1.5s ease-in-out', 
      height: '100%',
      width: '100%',
      position: 'relative'
    }}>
      <Line options={customOptions} data={data} />
    </div>
  );
}