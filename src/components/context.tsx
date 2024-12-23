"use client";
import React, {
    createContext,
    useState,
    type ReactNode,
    useContext,
} from "react";



interface AppContextProps {
    setting: boolean
    setSetting: (setting: boolean) => void;
    edit: boolean;
    setEdit: (edit: boolean) => void;
    analytics: boolean;
    setAnalytics: (analytics: boolean) => void;
    notification: boolean;
    setNotification: (notification: boolean) => void;
    selectedCase: string;
    setSelectedCase: (selectedCase: string) => void;
    username: string | null;
    setUsername: (username: string | null) => void;
    uid: string | undefined;
    setUid: (uid: string | undefined) => void;
    isUserPage: boolean;
    setIsUserPage: (isUserPage: boolean) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [setting, setSetting] = useState(false);
    const [edit, setEdit] = useState(false);
    const [analytics, setAnalytics] = useState(false);
    const [notification, setNotification] = useState(false);
    const [selectedCase, setSelectedCase] = useState<string>('Overview');
    const [username, setUsername] = useState<string | null>(null);
    const [uid, setUid] = useState<string | undefined>(undefined);
    const [isUserPage, setIsUserPage] = useState(false);

    const value = {
        setting,
        setSetting,
        edit,
        setEdit,
        analytics,
        setAnalytics,
        notification,
        setNotification,
        selectedCase,
        setSelectedCase,
        username,
        setUsername,
        uid,
        setUid,
        isUserPage,
        setIsUserPage,
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("error in general result page context");
    }
    return context;
};