import "./Loading.css"
import pic from "../../images/loderIcon.gif";

function Loading() {
  return (
    <div className='loadingMain z-30'>
      <img src={pic} alt='Loading....' />
    </div>
  )
}

export default Loading