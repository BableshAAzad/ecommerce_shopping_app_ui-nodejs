import spin from "../../images/spinner1.gif"

function Spinner() {
    return (
      <div className='flex justify-center items-center mt-5'>
        <img className='my-5' src={spin} alt="Loading" width={100} height={100} />
      </div>
    )
}

export default Spinner
