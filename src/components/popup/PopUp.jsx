import { useEffect } from 'react'
import "./PopUp.css"
import ReactDOM from 'react-dom'

function PopUp({ bgcolor, msg }) {
    useEffect(() => {
        document.body.style.overflowY = "hidden"
        return () => {
            document.body.style.overflowY = "scroll"
        }
    }, [])
    return ReactDOM.createPortal(
        <>
            <div className='popup-wrapper'></div>
            <div className='popUpMain' style={{ backgroundColor: `${bgcolor}` }}>
                {msg}
            </div>
        </>,
        document.getElementById("otherroot")
    )
}

export default PopUp
