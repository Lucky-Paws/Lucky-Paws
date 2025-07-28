'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Signup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCareer, setSelectedCareer] = useState('교직 경력');
  const [schoolName, setSchoolName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [showCareerDropdown, setShowCareerDropdown] = useState(false);

  const careerOptions = ['1년차', '2년차', '3년차', '4년차', '5년차', '6-10년차', '11-20년차', '20년차 이상'];

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/landing');
    }
  }, [session, status, router]);

  const handleComplete = () => {
    // TODO: 서버에 프로필 정보 저장
    console.log({
      profileImage,
      selectedCareer,
      schoolName,
      documentFile
    });
    
    // 메인 페이지로 이동
    router.push('/');
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-medium">회원가입</h1>
        <div className="w-6"></div> {/* 공간 확보용 */}
      </header>

      <div className="p-6">
        {/* Profile Image Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              {profileImage ? (
                <img 
                  src={URL.createObjectURL(profileImage)} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleProfileImageChange}
                className="hidden" 
              />
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>
        </div>

        {/* School Selection Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">학교 선택</h2>
          
          {/* Career Dropdown */}
          <div className="mb-4">
            <div className="relative">
              <button
                onClick={() => setShowCareerDropdown(!showCareerDropdown)}
                className="w-full bg-gray-100 p-4 rounded-lg flex items-center justify-between text-left"
              >
                <span className={selectedCareer === '교직 경력' ? 'text-gray-500' : 'text-black'}>
                  {selectedCareer}
                </span>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCareerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {careerOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedCareer(option);
                        setShowCareerDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* School Name Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="학교"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-gray-100 p-4 rounded-lg pr-12"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">재직증명서 업로드</h2>
          <p className="text-sm text-gray-600 mb-4">
            안전하고 신뢰할 수 있는 멘토링 공간을 위해,<br />
            교사 인증(재직증명서)이 필요합니다.
          </p>
          
          <label className="block">
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 text-center cursor-pointer hover:bg-gray-50">
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png" 
                onChange={handleDocumentChange}
                className="hidden" 
              />
              <div className="flex items-center justify-between">
                <span className={documentFile ? 'text-black' : 'text-gray-500'}>
                  {documentFile ? documentFile.name : '증명서'}
                </span>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
          </label>
        </div>

        {/* Complete Button */}
        <div className="mt-8">
          <button
            onClick={handleComplete}
            className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
} 