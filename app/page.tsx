import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 via-red-400 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl">
        <h1 className="text-7xl font-bold text-red-600 mb-6">
          🔥 불주먹 피하기 🔥
        </h1>
        <h2 className="text-3xl text-gray-700 mb-4">Fire Fist Dodger</h2>
        <p className="text-xl text-gray-600 mb-12">
          하늘에서 떨어지는 불주먹을 피하는 스릴 넘치는 아케이드 게임!
        </p>
        
        <Link
          href="/game"
          className="inline-block px-12 py-6 bg-red-500 hover:bg-red-600 text-white text-3xl font-bold rounded-lg shadow-lg transform transition hover:scale-105"
        >
          🎮 게임 시작하기
        </Link>
        
        <div className="mt-12 text-gray-600">
          <p className="font-semibold mb-3 text-lg">게임 특징:</p>
          <ul className="space-y-2">
            <li>🔥 간단한 조작, 박진감 넘치는 게임플레이</li>
            <li>⚡ 점점 빨라지는 난이도와 레벨 시스템</li>
            <li>🏆 초보 해적부터 해적왕까지 6단계 레벨</li>
            <li>📱 PC와 모바일 모두 지원</li>
            <li>🎯 리더보드로 친구들과 경쟁</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
