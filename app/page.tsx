import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">실시간 분석</h1>
        <p className="text-xl mb-8 text-gray-400">Google Analytics 4 실시간 대시보드</p>
        <Link 
          href="/dashboard"
          className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:scale-105 transition-transform"
        >
          대시보드 열기
        </Link>
      </div>
    </div>
  );
}
