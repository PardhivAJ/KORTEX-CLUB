import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] text-[#f5f5f3]">
      <div className="text-center">
        <p className="text-7xl font-black text-[#f5f5f3]">404</p>
        <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-[#a5a5a0]">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-4 py-2 bg-[#f5f5f3] text-[#080808] rounded hover:bg-[#e0e0e0] transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}