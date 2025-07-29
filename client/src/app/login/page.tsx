'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    keepLoggedIn: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 임시 로그인 (백엔드 연결 전)
      if (formData.username === 'test' && formData.password === 'test') {
        const result = await signIn('credentials', {
          username: formData.username,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('세션 생성에 실패했습니다.');
        } else {
          // 로그인 성공 시 메인 페이지로 이동
          router.push('/');
        }
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleFindId = () => {
    alert('아이디 찾기 기능은 백엔드 연결 후 구현됩니다.');
  };

  const handleFindPassword = () => {
    alert('비밀번호 찾기 기능은 백엔드 연결 후 구현됩니다.');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Bar */}
      <div className="h-6 bg-white"></div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* App Logo */}
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-500 text-sm text-center">어플로고</span>
        </div>
        
        {/* App Name */}
        <h1 className="text-2xl font-bold text-black mb-12">어플이름</h1>
        
        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          {/* Username Input */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="아이디"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-base"
              required
            />
          </div>
          
          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-base"
              required
            />
          </div>
          
          {/* Login Options */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="keepLoggedIn"
                checked={formData.keepLoggedIn}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">로그인 유지</span>
            </label>
            
            <div className="flex items-center space-x-2 text-sm">
              <button
                type="button"
                onClick={handleFindId}
                className="text-gray-600 hover:text-gray-800"
              >
                아이디 찾기
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={handleFindPassword}
                className="text-gray-600 hover:text-gray-800"
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          
          {/* Sign Up Button */}
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full bg-gray-200 text-black py-3 rounded-lg font-medium hover:bg-gray-300"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
} 