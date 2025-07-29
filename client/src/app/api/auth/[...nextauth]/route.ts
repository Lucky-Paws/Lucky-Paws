import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { authService } from "@/services/authService";

// 타입 확장을 위한 인터페이스 정의
interface ExtendedToken extends JWT {
  accessToken?: string;
  provider?: string;
  userId?: number;
  nickname?: string;
  careerYear?: number;
  schoolLevel?: string;
}

interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    provider?: string;
    id?: number;
    nickname?: string;
    careerYear?: number;
    schoolLevel?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 임시 로그인 (백엔드 연결 전)
        if (credentials.username === "test" && credentials.password === "test") {
          return {
            id: "1",
            name: "테스트 사용자",
            email: "test@example.com",
          };
        }
        
        return null;
      }
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      profile(profile) {
        const kakaoId = profile.id;
        
        return {
          id: kakaoId,
          name: profile.properties?.nickname,
          email: profile.kakao_account?.email || `kakao_${kakaoId}@noemail.local`,
          image: profile.properties?.profile_image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 로그인 시 JWT 토큰에 추가 정보 포함
      if (account && user) {
        // 소셜 로그인인 경우 백엔드 API 호출
        if ((account.provider === 'kakao' || account.provider === 'google') && account.access_token) {
          try {
            let response;
            if (account.provider === 'kakao') {
              response = await authService.kakaoLogin(account.access_token);
            } else {
              response = await authService.googleLogin(account.access_token);
            }
            
            if (response.success && response.data) {
              // 백엔드에서 받은 사용자 정보로 토큰 업데이트
              return {
                ...token,
                accessToken: response.data.token,
                provider: account.provider,
                userId: response.data.id,
                nickname: response.data.nickname,
                careerYear: response.data.careerYear,
                schoolLevel: response.data.schoolLevel,
              };
            }
          } catch (error) {
            console.error(`${account.provider} 로그인 API 호출 실패:`, error);
          }
        }
        
        return {
          ...token,
          accessToken: account.access_token,
          provider: account.provider,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 추가 정보 포함
      const extendedToken = token as ExtendedToken;
      const extendedSession = session as ExtendedSession;
      
      if (extendedSession.user) {
        extendedSession.user.accessToken = extendedToken.accessToken;
        extendedSession.user.provider = extendedToken.provider;
        // 백엔드에서 받은 추가 정보도 포함
        if (extendedToken.userId) {
          extendedSession.user.id = extendedToken.userId;
        }
        if (extendedToken.nickname) {
          extendedSession.user.nickname = extendedToken.nickname;
        }
        if (extendedToken.careerYear) {
          extendedSession.user.careerYear = extendedToken.careerYear;
        }
        if (extendedToken.schoolLevel) {
          extendedSession.user.schoolLevel = extendedToken.schoolLevel;
        }
      }
      
      return extendedSession;
    },
  },
});

export { handler as GET, handler as POST };