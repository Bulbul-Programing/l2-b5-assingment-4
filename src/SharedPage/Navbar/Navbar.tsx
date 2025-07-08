import { NavLink } from "react-router-dom";
import './Navbar.css';
import CreateNewBook from "@/MyComponent/Books/CreateNewBook";
const Navbar = () => {
    const navElement = (
        <>
            <NavLink
                className="px-4 border-b border-transparent py-1 mr-2 rounded-b-xs text-[#34495E] hover:text-[#3498DB] font-bold font-[lato]"
                to="/"
            >
                Home
            </NavLink>
            <NavLink
                className="px-4 border-b border-transparent py-1 mr-2 rounded-b-xs text-[#34495E] hover:text-[#3498DB] font-bold font-[lato]"
                to="/books"
            >
                All Books
            </NavLink>
            <NavLink
                className="px-4 border-b border-transparent py-1 mr-2 rounded-b-xs text-[#34495E] hover:text-[#3498DB] font-bold font-[lato]"
                to="/borrow-summary"
            >
                Borrow-summary
            </NavLink>
        </>
    );
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navElement}
                    </ul>
                </div>
                <NavLink
                    className="px-4 py-1 mr-2"
                    to="/"
                >
                    <div className="flex items-center gap-x-2">
                        <img className="w-12" src="https://res.cloudinary.com/depy0i4bl/image/upload/v1751637197/12151189_4926335_vfbna9.png" alt="" />
                        <p className="text-3xl font-bold">Librarify</p>
                    </div>
                </NavLink>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navElement}
                </ul>
            </div>
            <div className="navbar-end">
                <CreateNewBook />
            </div>
        </div>
    );
};

export default Navbar;