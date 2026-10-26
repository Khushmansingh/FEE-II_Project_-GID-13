import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { validatePassword } from './utils/validators';
import Input from './components/common/Input';
import Button from './components/common/Button';

export function UpdatePassword({ onComplete }) {
    const { updatePassword } = useAuth();
    const toast = useToast();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    async function handleUpdatePassword(e) {
        e.preventDefault();

        const passErr = validatePassword(password);
        if (passErr) {
            setErrors({ password: passErr });
            return;
        }

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match.' });
            return;
        }

        setIsLoading(true);
        try {
            await updatePassword(password);
            toast.success('Password updated successfully!');
            onComplete?.();
        } catch (error) {
            toast.error('Error updating password: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-[460px] bg-surface-container-lowest/95 backdrop-blur-xl rounded-3xl shadow-xl border border-surface-variant p-6 sm:p-8 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-fixed/40 text-primary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">lock_reset</span>
                </div>

                <h1 className="font-headline-md text-2xl font-bold mb-1 text-center text-on-surface">
                    Reset Your Password
                </h1>
                <p className="text-on-surface-variant text-center mb-6 text-sm">
                    Enter your new secure password for your Campus Vault account.
                </p>

                <form onSubmit={handleUpdatePassword} className="w-full flex flex-col gap-4">
                    <Input
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        placeholder="••••••••••••"
                        required
                        error={errors.password}
                        icon="lock"
                        rightAction={
                            <button 
                                type="button" 
                                className="text-outline hover:text-on-surface flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        }
                    />

                    <Input
                        label="Confirm New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }}
                        placeholder="••••••••••••"
                        required
                        error={errors.confirmPassword}
                        icon="check_circle"
                    />

                    <Button 
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        icon="save"
                        className="w-full mt-2"
                    >
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default UpdatePassword;
