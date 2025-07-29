import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// 타입 확장을 위한 인터페이스 정의
interface ExtendedToken extends JWT {
  accessToken?: string;
  provider?: string;
}

interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    provider?: string;
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
        // email이 없으면 대체 이메일 생성
        const kakaoId = profile.id;
        const email = profile.kakao_account?.email || `kakao_${kakaoId}@noemail.local`;
        return {
          id: kakaoId,
          name: profile.properties?.nickname,
          email,
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
      }
      
      return extendedSession;
    },
  },
});

export { handler as GET, handler as POST };