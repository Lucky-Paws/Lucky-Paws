import { supabase } from '@/lib/supabase/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  type: 'mentor' | 'mentee';
  teacherType?: string;
}

export const supabaseAuthService = {
  async login(credentials: LoginCredentials) {
    console.log('Login attempt with email:', credentials.email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    console.log('Auth successful, user ID:', data.user?.id);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // If profile doesn't exist, create one
      if (profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: credentials.email,
            name: data.user.email?.split('@')[0] || 'User',
            type: 'mentee',
            is_verified: false,
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('Profile creation error:', createError);
          throw createError;
        }
        
        return {
          user: newProfile,
          session: data.session,
        };
      }
      throw profileError;
    }

    return {
      user: profile,
      session: data.session,
    };
  },

  async signup(signupData: SignupData) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
    });

    if (authError) throw authError;

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user!.id,
        email: signupData.email,
        name: signupData.name,
        type: signupData.type,
        teacher_type: signupData.teacherType,
        is_verified: false,
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    return {
      user: profile,
      session: authData.session,
    };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async updateProfile(userId: string, updates: Partial<{
    name: string;
    bio: string;
    avatar: string;
  }>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};