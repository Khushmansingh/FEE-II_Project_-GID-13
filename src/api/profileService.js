import { supabase } from '../supabaseClient';

export const profileService = {
    /**
     * Get user profile by email or user id
     */
    async getProfile(email) {
        if (!email) return null;
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            console.warn('Could not fetch profile:', error.message);
            return null;
        }
        return data;
    },

    /**
     * Create or update student profile
     */
    async upsertProfile({ email, name, branch, year, bio }) {
        const payload = {
            email,
            name: name || email.split('@')[0],
            branch: branch || 'Computer Science & Engineering',
            year: year || '3rd Year (Sem 3)',
            bio: bio || 'Student at Chitkara University exploring technology.'
        };

        const { data, error } = await supabase
            .from('profiles')
            .upsert(payload, { onConflict: 'email' })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
