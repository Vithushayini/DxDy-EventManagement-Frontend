import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../store/slices/authSlice.js';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { status, error } = useSelector((state) => state.auth);
  const status = 'idle';
  const error = null;

  const submit = async (event) => {
    event.preventDefault();
    // const result = await dispatch(loginUser({ email, password }));
    // if (loginUser.fulfilled.match(result)) {
    //   navigate('/');
    // }
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8">
      <h1 className="text-3xl font-bold text-white">Sign in</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="input" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" className="input" />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white" type="submit">
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;