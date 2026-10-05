import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CarFront,
  LogOut,
  Shield,
  Menu,
  X,
  History,
  Heart,
} from "lucide-react";

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-primary-500 to-blue-600 p-2 rounded-xl group-hover:scale-105 group-active:scale-95 transition-transform shadow-md">
                <CarFront className="h-6 w-6 text-white" />
              </div>

              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-800 to-primary-500 tracking-tight">
                AutoVault
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                {/* ================= USER NAVIGATION ================= */}
                {!isAdmin && (
                  <>
                    {/* Inventory */}
                    <Link
                      to="/"
                      className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg font-medium transition-colors hover:bg-primary-50/50"
                    >
                      Inventory
                    </Link>

                    {/* Wishlist */}
                    <Link
                      to="/wishlist"
                      className="flex items-center space-x-1.5 text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg font-medium transition-colors hover:bg-primary-50/50"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>

                    {/* Purchase History */}
                    <Link
                      to="/purchases"
                      className="flex items-center space-x-1.5 text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg font-medium transition-colors hover:bg-primary-50/50"
                    >
                      <History className="h-4 w-4" />
                      <span>Purchase History</span>
                    </Link>
                  </>
                )}

                {/* ================= ADMIN NAVIGATION ================= */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg font-medium transition-colors hover:bg-primary-50/50"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                {/* User Info + Logout */}
                <div className="flex items-center space-x-4 pl-2">
                  <span className="text-sm text-slate-500">
                    Welcome{" "}
                    <span className="font-semibold text-slate-800">
                      {user.name}
                    </span>
                  </span>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center h-9 w-9 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              /* ================= LOGGED OUT ================= */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 transition-colors"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="btn-primary py-2 px-5 text-sm shadow-primary-500/30"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 absolute w-full animate-fade-in shadow-xl">
          <div className="px-4 pt-2 pb-4 space-y-1">

            {user ? (
              <>
                {/* ================= USER MOBILE NAVIGATION ================= */}
                {!isAdmin && (
                  <>
                    {/* Inventory */}
                    <Link
                      to="/"
                      className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Inventory
                    </Link>

                    {/* Wishlist */}
                    <Link
                      to="/wishlist"
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                    </Link>

                    {/* Purchase History */}
                    <Link
                      to="/purchases"
                      className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Purchase History
                    </Link>
                  </>
                )}

                {/* ================= ADMIN MOBILE NAVIGATION ================= */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* User Info + Logout */}
                <div className="border-t border-slate-200 pt-4 mt-2">
                  <div className="px-3 text-base font-semibold text-slate-800">
                    {user.name}
                  </div>

                  <div className="px-3 text-sm text-slate-500 mb-3">
                    {user.email}
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            ) : (
              /* ================= LOGGED OUT MOBILE ================= */
              <div className="space-y-3 pt-2">
                <Link
                  to="/login"
                  className="block px-3 py-2.5 text-center rounded-lg text-base font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="block px-3 py-2.5 text-center rounded-lg text-base font-medium text-white bg-gradient-to-r from-primary-600 to-blue-500 shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};