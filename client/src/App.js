import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';



function App() {

 useEffect(() => {
   function setAppHeight() {
     const offset = 120;

     document.documentElement.style.setProperty(
       "--app-height",
       window.innerHeight - offset + "px",
     );
   }

   setAppHeight(); // 👉 initial call

   window.addEventListener("resize", setAppHeight);

   return () => {
     window.removeEventListener("resize", setAppHeight);
   };
 }, []);
  return (
   <>
      <Toaster/>
       <main >
        <Outlet/>
       </main>
   </>
  );
}

export default App;
