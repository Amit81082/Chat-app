import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import Sidebar from '../components/Sidebar'
import { logout, setOnlineUser, setUser } from '../redux/userSlice'
import { socketConnection } from '../socket/socket'

const Home = () => {
  const user = useSelector(state => state.user)
  // console.log("user data from redux",user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading,setLoading] = useState(false)


  useEffect(() => {
    const localUser = localStorage.getItem("user");

    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      dispatch(setUser(parsedUser)); // 👉 instant load
      socketConnection.emit("sidebar", parsedUser?._id);
    }
  }, []);

  const fetchUserDetails = async()=>{
    try {
        setLoading(true);
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
        const response = await axios({
          url : URL,
          withCredentials : true
        })


        // console.log('current user details', response)
         const userData = response?.data?.data;
         dispatch(setUser(userData));
         localStorage.setItem("user", JSON.stringify(userData));

        if(response.data.data.logout){
            dispatch(logout())
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/email")
        }
        // console.log("current user Details",response)
    } catch (error) {
        console.log("error",error)
    }finally{
        setLoading(false)
    }
  }

  useEffect(() => {
    const localUser = localStorage.getItem("user");

    if (!localUser) {
      fetchUserDetails(); // 👉 only if NOT in localStorage
    }
  }, []);



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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
            <p className="text-white mt-4 font-medium">Please wait 20-30 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home
