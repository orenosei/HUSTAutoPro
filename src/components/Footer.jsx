import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaGithub
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center space-y-6">
        <div className="flex justify-center mt-0"> 
          <img
            src="/hustautopro.png"
            alt="Showroom xe"
            className="w-60"
          />
        </div>

        <p className="text-center text-gray-700 text-xl font-semibold italic tracking-wide">
          Lướt tìm xe hay, chốt ngay giá tốt.
        </p>

        <ul className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
          {['About', 'Careers', 'History', 'Services', 'Projects', 'Blog'].map((item, idx) => (
            <li key={idx}>
              <a className="text-gray-700 transition hover:text-gray-700/75" href="#">
                {item}
              </a>
            </li>
          ))}
        </ul>

        <ul className="flex justify-center gap-6 md:gap-8">
          <li>
            <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:text-teal-600">
              <FaFacebookF className="size-5" />
            </a>
          </li>
          <li>
            <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:text-pink-500">
              <FaInstagram className="size-5" />
            </a>
          </li>
          <li>
            <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:text-fuchsia-500">
              <FaTiktok className="size-5" />
            </a>
          </li>
          <li>
            <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:text-black">
              <FaGithub className="size-5" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
