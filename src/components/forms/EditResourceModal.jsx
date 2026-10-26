import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { LOCATIONS, filesService } from '../../api/filesService';
import { useToast } from '../../context/ToastContext';
import { validateRequired } from '../../utils/validators';

export function EditResourceModal({
    isOpen,
    onClose,
    note,
    onSuccess
}) {
    const toast = useToast();
    const [title, setTitle] = useState(note?.title || '');
    const [subject, setSubject] = useState(note?.subject || '');
    const [locationId, setLocationId] = useState(note?.location || 'fee');
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const titleErr = validateRequired(title, 'Document title');
        if (titleErr) {
            setErrors({ title: titleErr });
            return;
        }

        setIsSaving(true);
        try {
            const updated = await filesService.updateFile(note.id, {
                name: title.trim(),
                subject: subject.trim(),
                location_id: locationId
            });

            toast.success('Resource updated successfully!');
            onSuccess?.(updated);
            onClose();
        } catch (err) {
            console.error('Failed to update file:', err);
            toast.error('Failed to update resource: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!note) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Resource Details"
            description="Update title, subject, or course category for this resource."
            maxWidth="max-w-lg"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Resource Title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                    }}
                    placeholder="e.g. Unit 2 Summary Notes.pdf"
                    required
                    error={errors.title}
                />

                <Input
                    label="Subject / Topic"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Advanced Routing & Context API"
                    helperText="Optional topic or syllabus description"
                />

                <Select
                    label="Course Category"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    options={LOCATIONS.map(l => ({ id: l.id, name: `${l.name} — ${l.description}` }))}
                    required
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container mt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSaving}
                        icon="save"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default EditResourceModal;
