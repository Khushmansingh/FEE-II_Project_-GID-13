import { supabase } from '../supabaseClient';

export const LOCATIONS = [
    { id: 'fee', name: 'FEE-II', description: 'Front End Engineering II' },
    { id: 'opps', name: 'OPPS', description: 'Object Oriented Programming Systems' },
    { id: 'dbms', name: 'DBMS', description: 'Database Management Systems' },
    { id: 'dis', name: 'Discr', description: 'Discrete Mathematics' },
];

/**
 * Service to handle all files and storage operations
 */
export const filesService = {
    /**
     * Fetch all files from Supabase database
     */
    async fetchFiles() {
        const { data, error } = await supabase
            .from('files')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(file => ({
            id: file.id,
            title: file.name,
            subject: file.subject || '',
            location: file.location_id,
            date: file.created_at,
            downloads: file.downloads || 0,
            uploader: file.uploader || 'Anonymous',
            type: file.file_type || file.name.split('.').pop().toUpperCase(),
            size_bytes: file.size_bytes || 0,
            storage_path: file.storage_path
        }));
    },

    /**
     * Fetch a single file by ID
     */
    async fetchFileById(id) {
        const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return null;

        return {
            id: data.id,
            title: data.name,
            subject: data.subject || '',
            location: data.location_id,
            date: data.created_at,
            downloads: data.downloads || 0,
            uploader: data.uploader || 'Anonymous',
            type: data.file_type || data.name.split('.').pop().toUpperCase(),
            size_bytes: data.size_bytes || 0,
            storage_path: data.storage_path
        };
    },

    /**
     * Upload a new resource: stores file in Supabase storage and creates database record
     */
    async uploadFile({ file, locationId, subject = '', uploader = 'Anonymous' }) {
        const fileExt = file.name.split('.').pop();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${safeName}`;
        const filePath = `${locationId}/${fileName}`;

        // 1. Upload to storage bucket
        const { error: uploadError } = await supabase.storage
            .from('vault_files')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Insert record in files table
        const { data, error: dbError } = await supabase
            .from('files')
            .insert([{
                name: file.name,
                subject: subject.trim(),
                size_bytes: file.size,
                location_id: locationId,
                storage_path: filePath,
                uploader: uploader,
                file_type: fileExt.toUpperCase(),
                downloads: 0
            }])
            .select()
            .single();

        if (dbError) {
            // Attempt rollback of uploaded file in storage
            await supabase.storage.from('vault_files').remove([filePath]);
            throw dbError;
        }

        return data;
    },

    /**
     * Update resource metadata (name, subject, location)
     */
    async updateFile(id, { name, subject, location_id }) {
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (subject !== undefined) updates.subject = subject;
        if (location_id !== undefined) updates.location_id = location_id;

        const { data, error } = await supabase
            .from('files')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a resource (both file in storage and row in database)
     */
    async deleteFile(id, storagePath) {
        // 1. Delete from storage bucket if storagePath exists
        if (storagePath) {
            await supabase.storage
                .from('vault_files')
                .remove([storagePath]);
        }

        // 2. Delete from database
        const { error } = await supabase
            .from('files')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    /**
     * Download file blob, trigger browser save, and increment download count
     */
    async downloadFile(note) {
        const { data, error } = await supabase.storage
            .from('vault_files')
            .download(note.storage_path);

        if (error) throw error;

        // Trigger browser download via object URL
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = note.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Increment download counter asynchronously in DB
        const newDownloads = (note.downloads || 0) + 1;
        await supabase
            .from('files')
            .update({ downloads: newDownloads })
            .eq('id', note.id);

        return newDownloads;
    }
};
