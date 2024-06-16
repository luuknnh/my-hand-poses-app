import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className=" text-orange-500    shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center h-16">
          <div className="flex space-x-4">
            {/* Andere nav items kunnen hier worden toegevoegd als dat nodig is */}

            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-orange-700"
            >
              Home
            </Link>
            <Link
              to="/track"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-orange-700"
            >
              Tracking
            </Link>
            {/* Meer links of andere inhoud kunnen hier worden toegevoegd */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
