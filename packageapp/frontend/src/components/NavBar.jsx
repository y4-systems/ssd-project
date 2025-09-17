import React , { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';


const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

//toggle menu

const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
}

useEffect(() => {
    const handleScroll = () => {
        if(window.scrollY > 100){
            setIsSticky(true);
        }
        else{
            setIsSticky(false);
        }
    }
    
    return () =>{
        window.addEventListener("scroll",handleScroll);
    }
}, []) 

//nav Items 

const navItems =[
    {link:"Home",path:"/"},
    {link:"Admin",path:"/admin/dashboard"},
    {link:"Packages",path:"/package"},
    

]

return (
   <header className='w-full bg-transparent fixed top-0 left-0 right-0  transition-all ease-in duration-300'>
    <nav className={`py-4 lg:px-24 px-4${isSticky ? "sticky top-0 left-0 right-0 bg-blue-300":""}`}>
       <div className='flex justify-between items-center text-base gap-8'>
            {/*logo*/}
            <Link to="/" style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0070f3', fontFamily: 'Calibri' }} className="flex items-center gap-2">Blissfy</Link>

            {/*nav items for large devices*/}
            
            <ul className='md:flex space-x-12 hidden'>
                {
                    navItems.map(({link,path}) => (<Link key={path} to={path} className='block text-base
                     text-black uppercase cursor-pointer hover:text-blue-700'>{link}</Link>))
                }
            </ul>

            {/*Button for lg device*/}

            <div className='space-x-12 hidden lg:flex items:center'></div>

        </div> 
        
     </nav>
   </header>
  )
}

export default NavBar;
