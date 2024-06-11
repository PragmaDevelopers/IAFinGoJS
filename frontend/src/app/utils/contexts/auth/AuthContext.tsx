import { ReactElement, ReactNode, createContext, useContext, useState, Dispatch } from "react";

type AuthContextType = {
    token: string;
    setToken: Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({children}: { children: ReactNode }): ReactElement<any, any> {
    const [token, setToken] = useState<string>("");
    return (
        <AuthContext.Provider value={{token, setToken}}>
            { children }
        </AuthContext.Provider>
    )

}

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within a AuthContextProvider');
    }

    return context;
}
