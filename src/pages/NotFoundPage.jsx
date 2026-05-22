import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <h1 className="text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white">
        Go home
      </Link>
    </div>
  );
}
