"use client";
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-5 mt-3 max-h-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <span className="bg-blue-500 rounded-full w-4 h-4 inline-block mr-2"></span>
            JobHuntly
          </h2>
          <p className="mt-3 text-gray-400">
            Great platform for the job seeker that passionate about startups. Find your dream job easier.
          </p>
        </div>

        <div className="flex justify-between md:justify-around">
          <div>
            <h3 className="font-semibold">About</h3>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li><a href="#">Companies</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Advice</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Resources</h3>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li><a href="#">Help Docs</a></li>
              <li><a href="#">Guide</a></li>
              <li><a href="#">Updates</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Get job notifications</h3>
          <p className="text-gray-400 text-sm mt-2">The latest job news, articles, sent to your inbox weekly.</p>
          <div className="mt-4 flex">
            <input type="email" placeholder="Email Address" className="w-full p-2 rounded-l-md bg-gray-800 border border-gray-600 text-white focus:outline-none" />
            <button className="bg-blue-600 px-4 py-2 rounded-r-md">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-center items-center w-full text-center">
          <p className="text-gray-400 text-sm">2025 @ JobHuntly. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 ml-3">
            <FaFacebookF className="text-gray-400 hover:text-white cursor-pointer" />
            <FaInstagram className="text-gray-400 hover:text-white cursor-pointer" />
            <FaGithub className="text-gray-400 hover:text-white cursor-pointer" />
            <FaLinkedinIn className="text-gray-400 hover:text-white cursor-pointer" />
            <FaTwitter className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
