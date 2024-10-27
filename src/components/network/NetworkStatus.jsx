import { useState, useEffect } from 'react';
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <>
            {isOnline ? (
                <FontAwesomeIcon icon={faGlobe} style={{ color: 'green', width: "0.7rem" }} />
            ) : (
                <FontAwesomeIcon icon={faGlobe} style={{ color: 'red', width: "0.7rem" }} />
            )}
        </>
    );
}

export default NetworkStatus;
