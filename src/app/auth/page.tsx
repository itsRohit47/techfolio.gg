'use client';
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import Link from "next/link";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

function validateUsername(username: string | null): boolean {
    return username !== null && username.length >= 5 && username.length <= 10 && /^[a-zA-Z0-9_]+$/.test(username);
}

export default function Home() {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(false);
    const { data = null } = api.user.isUserNameAvailable.useQuery(
        { username: username },
        { enabled: validateUsername(username) }
    );
    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Content
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                username={username}
                setUsername={setUsername}
                isUsernameAvailable={isUsernameAvailable}
                setIsUsernameAvailable={setIsUsernameAvailable}
                data={data}
                isUsernameValid={isUsernameValid}
                setIsUsernameValid={setIsUsernameValid}
            />
        </Suspense>
    );
}

function Content({ isLogin, setIsLogin, username, setUsername, isUsernameAvailable, setIsUsernameAvailable, data, isUsernameValid, setIsUsernameValid }: {
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
    username: string | null;
    setUsername: (value: string | null) => void;
    isUsernameAvailable: boolean;
    setIsUsernameAvailable: (value: boolean) => void;
    data: boolean | null;
    isUsernameValid: boolean;
    setIsUsernameValid: (value: boolean) => void;
}) {
    const params = useSearchParams();

    useEffect(() => {
        if (params.has('user')) {
            setUsername(params.get('user'));
        }
    }, [params, setUsername]);

    // if params have signin, set isLogin to true
    useEffect(() => {
        if (params.has('signin')) {
            setIsLogin(true);
        }
        if (params.has('new_user')) {
            setIsLogin(false);
        }
    }, [params, setIsLogin]);

    useEffect(() => {
        if (data === false) {
            setIsUsernameAvailable(false);
        }
        if (data === true) {
            setIsUsernameAvailable(true);
        }
    }, [data]);

    useEffect(() => {
        if (validateUsername(username)) {
            setIsUsernameValid(true);
        } else {
            setIsUsernameValid(false);
        }
    }, [setIsUsernameValid, username]);

    useEffect(() => {
        if (isLogin) {
            setUsername(null);
            setIsUsernameValid(true);
            setIsUsernameAvailable(true);
        }
    }, [isLogin, setIsUsernameAvailable, setIsUsernameValid, setUsername]);

    return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-screen h-full">
            <div className="flex flex-col gap-2 items-center justify-center p-4 z-20 bg-secondary  border-2  rounded-md shadow-xl">
                <Link href="/" className="gradient">cyberportfol.io</Link>
                <span className="text-xl font-normal "> {isLogin ? 'Sign in to your account' : 'Create a free account'} </span>
                <div className="flex mt-5 flex-col gap-2 items-center justify-center">
                    <input
                        type="email"
                        className="p-2 border border-gray-700 rounded-md text-sm min-w-96"
                        placeholder="Email (not available right now)"
                        disabled
                    />
                    <input
                        type="password"
                        className="p-2 border border-gray-700 rounded-md text-sm min-w-96"
                        placeholder="Password (not available right now)"
                        disabled
                    />
                </div>
                {isLogin ? null : <div className="flex flex-col gap-2 items-center justify-center">
                    <div className={`flex gap-px items-center border border-gray-700 rounded-lg p-2 shadow-xl min-w-96 ${isUsernameAvailable && isUsernameValid ? 'border-green-500' : 'border-red-500'}`}>
                        <div className="gradient text-sm">cyberportfol.io/</div>
                        <input
                            type="text"
                            defaultValue={username ?? ''}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            className={`p-0 w-full border-none bg-transparent rounded-none text-sm text-secondary outline-none focus:ring-0 `}
                            placeholder="rohitbajaj"
                            minLength={5}
                        />
                    </div>
                    {!isUsernameValid ? (
                        <InvalidUsername />
                    ) : !isUsernameAvailable ? (
                        <UnavailableUsername />
                    ) : null}
                </div>}
                <button
                    onClick={() => {
                        if (isLogin) {
                            void signIn('credentials', { callbackUrl: '/' });
                        } else if (isUsernameValid && isUsernameAvailable) {
                            // Handle sign up logic here
                        }
                    }}
                    className={`bg-primary border border-gray-700 p-2 min-w-96 rounded-md text-sm flex items-center justify-center gap-3 hover:bg-secondary  cursor-not-allowed`}
                    disabled={!isLogin && (!isUsernameValid || !isUsernameAvailable)}
                >
                    <div> {isLogin ? 'Sign in' : 'Continue'} with <span className="gradient">cyberportfol.io</span></div>
                </button>

            </div>
            <div className="flex flex-col gap-2 items-center justify-center p-4 z-20 bg-secondary  border-2  rounded-md shadow-xl">
                <button
                    onClick={() => {
                        if (isLogin || (isUsernameValid && isUsernameAvailable)) {
                            void signIn('discord', { callbackUrl: '/' });
                        }
                    }}
                    className={`bg-primary border border-gray-700 p-2 min-w-96 rounded-md text-sm flex items-center justify-center gap-3 hover:bg-secondary ${(!isLogin && (!isUsernameValid || !isUsernameAvailable)) ? 'cursor-not-allowed' : ''}`}
                    disabled={!isLogin && (!isUsernameValid || !isUsernameAvailable)}
                >
                    <Image src="/discord.svg" alt="g logo" width={24} height={24}></Image>
                    <div>{isLogin ? 'Sign in' : 'Continue'} with Discord</div>
                </button>
                <button
                    onClick={() => {
                        if (isLogin || (isUsernameValid && isUsernameAvailable)) {
                            void signIn('github', { callbackUrl: `/` });
                        }
                    }}
                    className={`bg-primary border border-gray-700 p-2 min-w-96 rounded-md text-sm flex items-center justify-center gap-3 hover:bg-secondary ${(!isLogin && (!isUsernameValid || !isUsernameAvailable)) ? 'cursor-not-allowed' : ''}`}
                    disabled={!isLogin && (!isUsernameValid || !isUsernameAvailable)}
                >
                    <Image src="/git.png" alt="g logo" width={24} height={24} className=""></Image>
                    <div>{isLogin ? 'Sign in' : 'Continue'} with GitHub</div>
                </button>

            </div>
            {isLogin ? <button className="text-secondary mt-3 text-right hover:underline text-sm" onClick={() => {
                setUsername(null);
                setIsUsernameValid(false);
                setIsLogin(!isLogin);
            }}>New here? create a free account</button>
                : <button className="text-secondary mt-3 hover:underline  text-right text-sm" onClick={() => setIsLogin(!isLogin)}>Already have an account? sign in</button>
            }
        </div>
    );
}

function InvalidUsername() {
    return (
        <div className="text-red-500 text-xs flex flex-col items-start gap-2 min-w-96">
            <div>Username must be between 5 and 10 characters long</div>
            <div>Username must contain only letters, numbers, and underscores</div>
        </div>
    );
}

function UnavailableUsername() {
    return (
        <div className="text-red-500 text-xs flex flex-col items-start gap-2 min-w-96">
            <div>Username is not available</div>
            <div>Try a different username</div>
        </div>
    );
}