'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';

type SignupType = 'normal' | 'social';

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signupType, setSignupType] = useState<SignupType>('normal');
  const [socialData, setSocialData] = useState<{email: string; name: string} | null>(null);
  
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    name: string;
    type: 'mentor' | 'mentee';
    teacherType?: string;
    bio?: string;
  }>({
    email: '',
    password: '',
    name: '',
    type: 'mentor',
    teacherType: undefined,
    bio: ''
  });

  const [selectedCareer, setSelectedCareer] = useState('교직 경력');
  const [selectedSchool, setSelectedSchool] = useState('학교 선택');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [showCareerDropdown, setShowCareerDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const careerOptions = ['1년차', '2년차', '3년차', '4년차', '5년차', '6-10년차', '11-20년차', '20년차 이상'];
  const schoolOptions = ['초등', '중등', '고등'];
  
  const teacherTypeMap: Record<string, string> = {
    '초등': '초등학교',
    '중등': '중학교',
    '고등': '고등학교'
  };

  useEffect(() => {
    // URL 파라미터에서 소셜 로그인 정보 확인
    const type = searchParams.get('type');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    
    if (type === 'social' && email && name) {
      setSignupType('social');
      setSocialData({ email, name });
      setFormData(prev => ({ ...prev, email, name }));
    }
  }, [searchParams]);

  const handleComplete = async () => {
    // 필수 필드 검증
    if (signupType === 'normal') {
      if (!formData.email || !formData.password || !formData.name || !formData.teacherType) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
      }
    } else {
      if (!formData.name || !formData.teacherType) {
        alert('이름과 학교를 선택해주세요.');
        return;
      }
    }

    setLoading(true);

    try {
      // 프로필 사진을 로컬 스토리지에 저장
      if (profileImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            localStorage.setItem('userProfileImage', e.target.result as string);
          }
        };
        reader.readAsDataURL(profileImage);
      }

      if (signupType === 'social' && socialData) {
        // 소셜 회원가입 완료
        const response = await authService.completeSocialSignup({
          email: socialData.email,
          name: formData.name,
          type: formData.type,
          teacherType: formData.teacherType?.replace('초등학교', 'elementary').replace('중학교', 'middle').replace('고등학교', 'high') as 'elementary' | 'middle' | 'high',
          yearsOfExperience: selectedCareer ? parseInt(selectedCareer.replace(/[^년짰0-9]/g, '')) : undefined
        });
        
        if (response.user) {
          console.log('Social signup completed:', response);
          alert('회원가입이 완료되었습니다.');
          window.location.href = '/';
        }
      } else {
        // 일반 회원가입
        const response = await authService.signup({
          ...formData,
          type: formData.type,
          teacherType: (formData.teacherType?.replace('초등학교', 'elementary').replace('중학교', 'middle').replace('고등학교', 'high') || 'elementary') as 'elementary' | 'middle' | 'high',
          yearsOfExperience: selectedCareer ? parseInt(selectedCareer.replace(/[^년짰0-9]/g, '')) : undefined
        });
        
        if (response.user) {
          alert('회원가입이 완료되었습니다.');
          window.location.href = '/';
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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

  const handleCareerSelect = (career: string) => {
    setSelectedCareer(career);
    setShowCareerDropdown(false);
    
    // 경력 저장은 필요시 추가 구현
  };

  const handleSchoolSelect = (school: string) => {
    setSelectedSchool(school);
    setShowSchoolDropdown(false);
    setFormData(prev => ({
      ...prev,
      teacherType: teacherTypeMap[school]
    }));
  };

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

      <div className="p-4">
        {/* Profile Image Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              {profileImage ? (
                <img 
                  src={URL.createObjectURL(profileImage)} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
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

        {/* Input Fields - 일반 회원가입일 때만 이메일/비밀번호 표시 */}
        <div className="space-y-4 mb-8">
          {signupType === 'normal' && (
            <>
              <input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-gray-100 p-4 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-gray-100 p-4 rounded-lg"
                required
              />
            </>
          )}
          <input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-gray-100 p-4 rounded-lg"
            required
          />
          <textarea
            placeholder="자기소개 (선택사항)"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full bg-gray-100 p-4 rounded-lg resize-none"
            rows={3}
          />
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
                      onClick={() => handleCareerSelect(option)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* School Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
              className="w-full bg-gray-100 p-4 rounded-lg flex items-center justify-between text-left"
            >
              <span className={selectedSchool === '학교 선택' ? 'text-gray-500' : 'text-black'}>
                {selectedSchool}
              </span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showSchoolDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {schoolOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSchoolSelect(option)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
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
            disabled={loading}
            className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : '완료'}
          </button>
        </div>
      </div>
    </div>
  );
}