import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <AlertTriangle size={80} className="text-red-500 mb-6" />
      <h1 className="text-5xl font-bold mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-6">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#197B4E] text-white rounded-lg shadow hover:bg-blue-[#197B4E] transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
