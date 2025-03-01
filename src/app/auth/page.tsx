'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

export default function AuthPage() {
    const [error, setError] = useState<string | null>(null);

    const handleGitHubSignIn = async () => {
        try {
            const result = await signIn('github', {
                callbackUrl: '/',
                redirect: false,
            });

            if (result?.error) {
                setError('Failed to sign in with GitHub');
                console.error('Auth error:', result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Sign in error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-4 p-8 bg-white rounded-lg shadow">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Sign in</h2>
                    <p className="mt-2 text-gray-600">Use your GitHub account</p>
                </div>
                {error && (
                    <div className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </div>
                )}
                <div>
                    <button
                        onClick={handleGitHubSignIn}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <FaGithub className="text-xl" />
                        Continue with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
}
