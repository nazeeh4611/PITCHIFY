import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`bg-white border-t border-gray-200 pt-8 pb-12 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">For Investors</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                How to connect
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Subscription details
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Personal Details
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Payment Details
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">For Entrepreneurs</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                How to connect
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Subscription details
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Personal Details
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Payment Details
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Help & support
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Success stories
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Resource
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Community
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Contact us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Partners
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                Our impact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-200 pt-8 flex justify-between items-center">
        <p className="text-gray-500">© 2015 - 2024 Pitchify® Global Inc.</p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-900">
            <span className="sr-only">Twitter</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-900">
            <span className="sr-only">Instagram</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z"
                clipRule="evenodd"
              />
              <path d="M10.001 7.511a2.589 2.589 0 10.004 5.178 2.589 2.589 0 00-.004-5.178z" />
              <path d="M12.008 10.002a1.584 1.584 0 11-3.068-.001 1.584 1.584 0 013.068.001z" />
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-900">
            <span className="sr-only">YouTube</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-900">
            <span className="sr-only">LinkedIn</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;