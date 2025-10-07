
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">InternMatch</h3>
            <p className="text-gray-300 text-sm">
              Connecting talented students with great companies for meaningful
              internship opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-emerald-300 hover:underline underline-offset-4 text-sm transition-colors duration-150">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-300 hover:text-emerald-300 hover:underline underline-offset-4 text-sm transition-colors duration-150">
                  Find Internships
                </Link>
              </li>
              <li>
                <Link to="/post-internship" className="text-gray-300 hover:text-emerald-300 hover:underline underline-offset-4 text-sm transition-colors duration-150">
                  Post Internship
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm">Email: info@internmatch.com</p>
            <p className="text-gray-300 text-sm">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-300">
            © 2023 InternMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;