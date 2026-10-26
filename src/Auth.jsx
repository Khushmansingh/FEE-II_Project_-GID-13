import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { validateEmail, validatePassword, validateUsername } from './utils/validators';
import Input from './components/common/Input';
import Button from './components/common/Button';

export function Auth() {
    const { signIn, signUp, resetPassword } = useAuth();
    const toast = useToast();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
        const newErrors = {};
        const emailErr = validateEmail(email);
        if (emailErr) newErrors.email = emailErr;

        const passErr = validatePassword(password, isSignUp);
        if (passErr) newErrors.password = passErr;

        if (isSignUp) {
            const userErr = validateUsername(username);
            if (userErr) newErrors.username = userErr;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix the errors in the form.');
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                await signUp(email.trim(), password, username.trim());
                toast.success('Account created! Check your email or you may be signed in automatically.');
                setIsSignUp(false);
            } else {
                await signIn(email.trim(), password);
                toast.success('Welcome back to Campus Vault!');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            toast.error(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        const emailErr = validateEmail(email);
        if (emailErr) {
            setErrors({ email: 'Please enter your email above to reset password.' });
            toast.error('Please enter your email above to receive a reset link.');
            return;
        }

        setIsResetting(true);
        try {
            await resetPassword(email.trim());
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error) {
            toast.error('Error sending reset link: ' + error.message);
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center p-4">
            <main className="w-full flex-1 flex flex-col items-center justify-center">
                <div className="flex flex-col w-full items-center justify-center relative py-12 px-4 max-w-[460px]">
                    {/* Background glows */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-fixed-dim/35 rounded-full blur-3xl pointer-events-none -z-10" />
                    <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-secondary-fixed-dim/30 rounded-full blur-3xl pointer-events-none -z-10" />

                    {/* Brand header */}
                    <div className="flex flex-col items-center text-center mb-6 space-y-2">
                        <div className="relative group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container p-0.5 shadow-md shadow-primary/20 flex items-center justify-center transition-transform hover:scale-105 duration-200">
                                <div className="w-full h-full bg-surface-container-lowest rounded-[14px] flex items-center justify-center overflow-hidden">
                                    <span className="material-symbols-outlined text-primary text-3xl">school</span>
                                </div>
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center shadow-xs">
                                <span className="material-symbols-outlined text-on-tertiary text-[10px]">verified</span>
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">
                                Campus Vault
                            </h1>
                            <p className="font-body-sm text-xs text-on-surface-variant max-w-xs">
                                Verified peer-to-peer repository for lecture notes &amp; course resources.
                            </p>
                        </div>
                    </div>

                    {/* Auth card */}
                    <div className="w-full bg-surface-container-lowest/95 backdrop-blur-xl rounded-3xl shadow-xl border border-surface-variant p-6 sm:p-8 flex flex-col">
                        {/* Tab switcher: Sign In vs Sign Up */}
                        <div className="relative w-full p-1 bg-surface-container-high rounded-xl flex items-center select-none mb-6">
                            <div 
                                className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-lg shadow-xs transition-transform duration-300 ease-out"
                                style={{ transform: isSignUp ? 'translateX(100%)' : 'translateX(0%)' }}
                            />
                            <button 
                                type="button"
                                className={`relative z-10 flex-1 py-1.5 text-center font-label-md text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                                    !isSignUp ? 'font-bold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'
                                }`}
                                onClick={() => {
                                    setIsSignUp(false);
                                    setErrors({});
                                }}
                            >
                                Sign In
                            </button>
                            <button 
                                type="button"
                                className={`relative z-10 flex-1 py-1.5 text-center font-label-md text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                                    isSignUp ? 'font-bold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'
                                }`}
                                onClick={() => {
                                    setIsSignUp(true);
                                    setErrors({});
                                }}
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Sign up banner */}
                        {isSignUp && (
                            <div className="mb-4 p-3 rounded-xl bg-tertiary-fixed/40 flex items-start gap-2.5">
                                <span className="material-symbols-outlined text-tertiary text-lg shrink-0 mt-0.5">verified</span>
                                <p className="font-body-sm text-xs leading-snug text-on-surface-variant">
                                    Join with your student account to upload and download verified campus notes.
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            {isSignUp && (
                                <Input
                                    label="Username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                                    }}
                                    placeholder="e.g. khushman_singh"
                                    required={isSignUp}
                                    error={errors.username}
                                    icon="person"
                                />
                            )}

                            <Input
                                label="College Email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                }}
                                placeholder="student@chitkara.edu.in"
                                required
                                error={errors.email}
                                icon="alternate_email"
                            />

                            <div className="flex flex-col gap-1">
                                <Input
                                    label="Password"
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
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    }
                                />

                                {!isSignUp && (
                                    <div className="flex justify-end mt-1">
                                        <button 
                                            type="button" 
                                            onClick={handleForgotPassword} 
                                            disabled={isResetting}
                                            className="font-label-sm text-xs text-primary hover:underline cursor-pointer disabled:opacity-50"
                                        >
                                            {isResetting ? 'Sending link...' : 'Forgot password?'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <Button 
                                type="submit"
                                variant="primary"
                                size="lg"
                                isLoading={isLoading}
                                icon={isSignUp ? 'person_add' : 'login'}
                                className="w-full mt-2"
                            >
                                {isSignUp ? 'Create Student Account' : 'Sign In to Campus Vault'}
                            </Button>
                        </form>
                    </div>

                    {/* Footer badge */}
                    <div className="mt-6 flex items-center justify-center gap-1.5 text-outline font-label-sm text-xs">
                        <span className="material-symbols-outlined text-sm text-tertiary">verified_user</span>
                        <span>Secure Campus Authentication (Supabase)</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Auth;
