import{
    createContext,
    useContext,
    useState,
    useEffect
} from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const[darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme === 'true') {
            setDarkMode(true);
        }

    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        }else{
            root.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{darkMode,toggleDarkMode}}>
            { children }
        </ThemeContext.Provider>
        
    );

};

export const useTheme = () => {
        const context = useContext(ThemeContext);
        if (!context) {
            throw new console.error('useTheme must be in the provider!');
            
        }
        return context;
    
};