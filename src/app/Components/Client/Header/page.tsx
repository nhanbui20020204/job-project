"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaCircle } from "react-icons/fa"; // Icon để tạo logo

const Header: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <>
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div
            className="text-2xl font-bold text-gray-900 flex items-center cursor-pointer"
            onClick={() => navigateTo("/")}
          >
            <FaCircle className="text-blue-600 mr-2 text-sm" />
            JobHuntly
          </div>

          <nav className="flex space-x-6 text-gray-700 font-medium">
            <span
              onClick={() => navigateTo("/client/job")}
              className="cursor-pointer hover:text-blue-600"
            >
              Find Jobs
            </span>
            <span
              onClick={() => navigateTo("/client/company")}
              className="cursor-pointer relative"
            >
              Browse Companies
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-blue-600 rounded-full"></span>
            </span>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <span
            onClick={() => navigateTo("/login")}
            className="cursor-pointer text-gray-700 hover:text-blue-600"
          >
            Login
          </span>
          <div className="h-6 border-l border-gray-400"></div>
          <button
            onClick={() => navigateTo("/register")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
    <div>
      <section className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900">
        Find your <span className="text-blue-500 underline ">dream companies</span>
      </h1>
      <p className="text-gray-500 mt-3">
        Find the dream companies you dream work for
      </p>
    </section>
    </div>
    </>
  );
};

export default Header;
