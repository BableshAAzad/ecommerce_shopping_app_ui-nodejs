import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react'

function DarkModeOption() {

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };


    return (
        <div>
            <button onClick={toggleTheme}>
                {<FontAwesomeIcon className={`${theme === 'dark' ? 'text-slate-50' : 'text-slate-900'}`}icon={faCircleHalfStroke} />}
            </button>
        </div>
    )
}

export default DarkModeOption
