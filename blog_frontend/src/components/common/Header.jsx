// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, X, Plus, User } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';

// const Header = () => {
//   const { user, logout } = useAuth();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setMobileMenuOpen(false);
//   };

//   return (
//     <header className="bg-white shadow-sm border-b sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="text-2xl font-bold text-gray-900">
//             BlogHub
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <Link 
//   to="/liked-posts" 
//   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// >
//   My Liked Posts
// </Link>
//             <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
//               Home
//             </Link>
//             {user ? (
//               <>
//                 <Link to="/create" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
//                   <Plus className="w-4 h-4" />
//                   <span>Write</span>
//                 </Link>
//                 <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
//                   <User className="w-4 h-4" />
//                   <span>Profile</span>
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
//                   Login
//                 </Link>
//                 <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </nav>

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2 rounded-md text-gray-700"
//           >
//             {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {mobileMenuOpen && (
//           <div className="md:hidden py-4 space-y-4">
//             <Link 
//               to="/" 
//               className="block text-gray-700 hover:text-blue-600 transition-colors"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Home
//             </Link>
//             {user ? (
//               <>
//                 <Link 
//                   to="/create" 
//                   className="block text-gray-700 hover:text-blue-600 transition-colors"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Write
//                 </Link>
//                 <Link 
//                   to="/profile" 
//                   className="block text-gray-700 hover:text-blue-600 transition-colors"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left text-red-600 hover:text-red-700 transition-colors"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link 
//                   to="/login" 
//                   className="block text-gray-700 hover:text-blue-600 transition-colors"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//                 <Link 
//                   to="/register" 
//                   className="block text-blue-600 hover:text-blue-700 transition-colors"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Sign Up
//                 </Link>
//               </>

//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Plus, User, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };
  
  // ✨ Centralized navigation links to avoid repetition
  const navLinks = [
    { to: '/', text: 'Home', auth: 'always' },
    { to: '/write', text: 'Write', icon: <Plus className="w-4 h-4" />, auth: true },
  ];

  const userDropdownLinks = [
    { to: '/profile', text: 'My Profile', icon: <User className="w-4 h-4" /> },
    { to: '/liked-posts', text: 'Liked Posts', icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            BlogHub
          </Link>

          {/* 🖥️ Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              (link.auth === 'always' || (link.auth === true && user)) && (
                <Link key={link.to} to={link.to} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              )
            ))}
            
            {user ? (
              // 👤 User Dropdown Menu
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                   <User className="w-5 h-5 text-gray-600" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    {userDropdownLinks.map(link => (
                       <Link key={link.to} to={link.to} onClick={() => setDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                         {link.icon}
                         <span>{link.text}</span>
                       </Link>
                    ))}
                    <div className="border-t border-gray-100"></div>
                    <button onClick={handleLogout} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login/Sign Up Buttons
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Sign Up</Link>
              </div>
            )}
          </nav>

          {/* 📱 Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-2 space-y-2 border-t">
          {navLinks.map(link => (
            (link.auth === 'always' || (link.auth === true && user)) && (
              <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md">
                {link.icon}
                <span>{link.text}</span>
              </Link>
            )
          ))}
          {user ? (
            <div className="border-t pt-4 space-y-2">
              {userDropdownLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md">
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              ))}
              <button onClick={handleLogout} className="w-full text-left flex items-center space-x-2 px-3 py-2 text-base text-red-600 hover:bg-gray-100 rounded-md">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="border-t pt-4 space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md">Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base text-blue-600 hover:bg-gray-100 rounded-md">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;