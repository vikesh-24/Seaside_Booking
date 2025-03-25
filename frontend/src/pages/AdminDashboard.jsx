import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout logic (e.g., clear session/token)
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div 
                className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-50`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold">Seaside Admin</h2>
                </div>
                <nav className="mt-6">
                    <ul className="space-y-2">
                        <li>
                            <Link 
                                to="/" 
                                className="block px-6 py-2 hover:bg-blue-700 transition"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/packages" 
                                className="block px-6 py-2 hover:bg-blue-700 transition"
                            >
                                Packages
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/profile" 
                                className="block px-6 py-2 hover:bg-blue-700 transition"
                            >
                                Users
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/donations" 
                                className="block px-6 py-2 hover:bg-blue-700 transition"
                            >
                                Donations
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/addGoal" 
                                className="block px-6 py-2 hover:bg-blue-700 transition"
                            >
                                Set Goals
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/settings" 
                                className="block px-6 py-2 hover:bg-blue-700 transition"
                            >
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Header */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <button 
                        className="md:hidden text-blue-800 focus:outline-none"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                    <div className="flex items-center space-x-4">
                        <span className="text-blue-800">Welcome, Seaside Admin</span>
                        <button 
                            onClick={handleLogout} 
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 p-6">
                    <Outlet /> {/* This will render the nested routes */}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
