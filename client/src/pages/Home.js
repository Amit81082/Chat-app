import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import { socketConnection } from '../socket/socket'

const Home = () => {
  const user = useSelector(state => state.user)
  // console.log("user data from redux",user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchUserDetails = async()=>{
    try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
        const response = await axios({
          url : URL,
          withCredentials : true
        })

        // console.log('current user details', response)
        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
            dispatch(logout())
            navigate("/email")
        }
        // console.log("current user Details",response)
    } catch (error) {
        console.log("error",error)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])

  /***socket connection */
  useEffect(() => {
    socketConnection.connect();
     socketConnection.on("connect", () => {
       console.log("✅ socket connected", socketConnection.id);
     });
    socketConnection.on("onlineUser", (data) => {
      console.log("online users", data);
      dispatch(setOnlineUser(data));
    });
     return () => {
       socketConnection.off("onlineUser"); // 👉 CLEAN ONLY EVENT
       // ❌ DON'T DISCONNECT HERE
     };
  }, []);

  // console.log("location", location)
  const basePath = location.pathname === '/'
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-full">
      <section className={`bg-white ${!basePath && "hidden"} lg:block h-full`}>
        <Sidebar />
      </section>

      {/**message component**/}
      <section className={`${basePath && "hidden"} h-full`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col hidden ${!basePath ? "hidden" : "lg:flex"}`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg -mt-8 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
}

export default Home
