
import { Outlet } from "react-router-dom"
import FooterComp from "../components/footer/FooterComp.jsx"
import HeaderComp from "../components/header/HeaderComp.jsx"
import LoadingBar from "react-top-loading-bar"
import { useContext } from "react"
import { AuthContext } from "../components/authprovider/AuthProvider.jsx"


function App() {
  let { progress } = useContext(AuthContext);
  return (
    <div className="dark:bg-slate-900">
      <HeaderComp />
      <LoadingBar
        color='#f11946'
        progress={progress}
        height={3}
      />
      <div className="pt-16"></div>
      <Outlet />
      <FooterComp />
    </div>
  )
}

export default App