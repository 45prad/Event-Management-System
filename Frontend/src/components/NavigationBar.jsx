import React, { useState, useEffect } from "react";
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
    Card,
    Collapse
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

export default function StickyNavbar() {
    const [openNav, setOpenNav] = useState(false);
    const [IsSignin, setIsSignin] = useState(false);
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );

        (async () => {
            await getUser();
        

        if (window.localStorage.getItem("FrAngel-auth-token")) {
            setIsSignin(true);
            await getUser();
        }
        else {
            navigate("/signin");
        }

    })()
    }, []);

    useEffect(() => {
        if (user.role == "hod") {
            navigate("/hod")
        }
        else if (user.role == "principle") {
            navigate("/principle")
        }
        else if (user.role == "commitee") {
            navigate("/commitee")
        }
        else if (user.role == "student") {
            navigate("/upcomingevents")
        }
    }, [user])

    const getUser = async () => {
        // API call
        const response = await fetch('https://event-management-system-ext9.onrender.com/api/auth/getuser', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
            },
        });
        const json = await response.json();
        setUser(json)
        console.log(user);

    }

    const handleSignout = async () => {
        localStorage.removeItem('FrAngel-auth-token');
        await getUser();
        navigate('/signin');
        setIsSignin(false);
        await getUser();
    }

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-1 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-4">
            {
                user.role == "hod"
                    ?
                    <>
                        <Typography
                            as="li"
                            className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                        >
                            <Link to="/hod" className="flex items-center">
                                HOD Portal
                            </Link>
                        </Typography>
                        <Typography
                            as="li"
                            className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                        >
                            <Link to="/principle/analysis" className="flex items-center">
                                Analysis
                            </Link>
                        </Typography>
                    </>

                    :
                    user.role == "commitee"
                        ?
                        <>
                            <Typography
                                as="li"
                                className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                            >
                                <Link to="/" className="flex items-center">
                                    All Events
                                </Link>
                            </Typography>
                            <Typography
                                as="li"
                                className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                            >
                                <Link to="/commitee" className="flex items-center">
                                    Commitee Portal
                                </Link>
                            </Typography>
                            <Typography
                                as="li"
                                className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                            >
                                <Link to="/registerations" className="flex items-center">
                                    Registerations
                                </Link>
                            </Typography>

                            <Typography
                                as="li"
                                className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                            >
                                <Link to="/committee/analysis" className="flex items-center">
                                    Feedback Analysis
                                </Link>
                            </Typography>

                        </>
                        :
                        user.role == "principle"
                            ?
                            <>
                                <Typography
                                    as="li"
                                    className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                                >
                                    <Link to="/principle" className="flex items-center">
                                        Principle Portal
                                    </Link>
                                </Typography>
                                <Typography
                                    as="li"
                                    className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                                >
                                    <Link to="/principle/analysis" className="flex items-center">
                                        Analysis Portal
                                    </Link>
                                </Typography>
                            </>
                            :
                            user.role == "system"
                                ?
                                <>
                                <Typography
                                    as="li"
                                    className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                                >
                                    <Link to="/System" className="flex items-center">
                                        System Portal
                                    </Link>
                                </Typography>
                                <Typography
                                    as="li"
                                    className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                                >
                                    <Link to="/adduser" className="flex items-center">
                                       Add User
                                    </Link>
                                </Typography>
                                <Typography
                                    as="li"
                                    className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                                >
                                    <Link to="/roombooking" className="flex items-center">
                                        Availabale Rooms
                                    </Link>
                                </Typography>
                                </>
                                :
                                <>
                                    <Typography
                                        as="li"
                                        className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                                    >
                                        <Link to="/student" className="flex items-center">
                                            Student Portal
                                        </Link>
                                    </Typography>
                                    <Typography
                                        as="li"
                                        className="p-1 font-normal text-black hover:bg-gray-300 px-4 rounded"
                                    >
                                        <Link to="/upcomingevents" className="flex items-center">
                                            Upcoming Events
                                        </Link>
                                    </Typography>

                                </>

            }
        </ul>
    );

    return (
        <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 shadow-lg ">
            <div className="flex items-center justify-between text-blue-gray-900">
                <Link
                    to="/"
                    className="mr-4 cursor-pointer text-xl font-extrabold text-black text-xl"
                >
                    FrAngel Events
                </Link>
                <div className="mr-4 hidden lg:block mr-auto text-md">{navList}</div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col text-black items-end">
                        <p>{user.email ? user.email : ""}</p>
                        <p>{user.role ? user.role : ""}</p>
                    </div>
                    <div className="flex items-center gap-x-1">
                        {
                            IsSignin ?
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    className="hidden lg:inline-block bg-black"
                                    onClick={handleSignout}
                                >
                                    <span>Logout</span>
                                </Button>
                                :
                                <div>
                                    <Button
                                        variant="text"
                                        size="sm"
                                        className="hidden lg:inline-block text-black"
                                    >
                                        <span>Log In</span>
                                    </Button>
                                    <Button
                                        variant="gradient"
                                        size="sm"
                                        className="hidden lg:inline-block bg-black"
                                    >
                                        <span>Sign in</span>
                                    </Button>
                                </div>
                        }
                    </div>
                    <IconButton
                        variant="text"
                        className="ml-auto bg-black h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"

                        ripple={false}
                        onClick={() => setOpenNav(!openNav)}
                    >
                        {openNav ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </IconButton>
                </div>
            </div>
            <MobileNav open={openNav}>
                {navList}
                {
                    IsSignin
                        ?
                        <Button fullWidth variant="gradient" size="sm" className="bg-black">
                            <span>Logout</span>
                        </Button>
                        :
                        <div className="flex items-center gap-x-1">
                            <Button fullWidth variant="text" size="sm" className="text-black">
                                <span>Log In</span>
                            </Button>
                            <Button fullWidth variant="gradient" size="sm" className="bg-black">
                                <span>Sign in</span>
                            </Button>
                        </div>

                }
            </MobileNav>
        </Navbar>

    );
}