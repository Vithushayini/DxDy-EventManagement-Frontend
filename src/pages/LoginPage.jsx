import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { 
  // sendRegistrationOTP,
  // verifyRegistrationOTP,
  // forgotPassword,
  // resetPassword,
  // clearError,
  // resetOTPState,
  googleLogin
} from '../Redux/Features/authSlice';
import { toast } from 'react-toastify';
// import { loginUser } from '../store/slices/authSlice.js';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState('email');
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [googleToastShown, setGoogleToastShown] = useState(false); // Track if Google toast has been shown

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { status, error } = useSelector((state) => state.auth);
    const { 
    loading, 
    error, 
    otpSent, 
    tempEmail,
    isAuthenticated 
  } = useSelector((state) => state.auth);
    

  const submit = async (event) => {
    event.preventDefault();
    // const result = await dispatch(loginUser({ email, password }));
    // if (loginUser.fulfilled.match(result)) {
    //   navigate('/');
    // }
  };

    // Google login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsGoogleLogin(true);
      
      await dispatch(googleLogin({
        credential: credentialResponse.credential
      })).unwrap();
      
      // Don't show any success toast here - will be handled by useEffect
    } catch (error) {
      toast.error(error || 'Google sign-in failed', { id: 'google' });
      setIsGoogleLogin(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in failed. Please try again.', {
      duration: 4000,
      position: 'top-right'
    });
  };

    // Show success message when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isGoogleLogin && !googleToastShown) {
        // Show Google-specific success message only once
        setGoogleToastShown(true);
        toast.success('Google sign-in successful! Redirecting...', {
          id: 'google-success',
          duration: 2000,
          position: 'top-right',
          icon: '🎉',
          style: {
            background: '#DEF7EC',
            color: '#03543F',
            border: '1px solid #BCF0DA'
          }
        });
        setTimeout(() => {
          setIsGoogleLogin(false);
          navigate('/');
        }, 2000);
      } else if (!isGoogleLogin) {
        // Show regular login success message
        toast.success('Successfully logged in! Redirecting...', {
          duration: 2000,
          position: 'top-right',
          icon: '🎉',
          style: {
            background: '#DEF7EC',
            color: '#03543F',
            border: '1px solid #BCF0DA'
          }
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }
  }, [isAuthenticated, isGoogleLogin, googleToastShown, navigate]);

    // Reset Google login state when component unmounts or when needed
  useEffect(() => {
    return () => {
      setIsGoogleLogin(false);
      setGoogleToastShown(false);
    };
  }, []);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8">
      <h1 className="text-3xl font-bold text-white">Sign in</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="input" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" className="input" />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white" type="submit">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded w-4 h-4 accent-primary-1"
            // disabled={loading}
            />
            <span className="text-xs md:text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(true);
              setForgotPasswordStep('email');
            }}
            className="text-xs md:text-sm text-primary-1 hover:underline"
          // disabled={loading}
          >
            Forgot password?
          </button>

         
        </div>
         {/* Divider with "OR" */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white rounded-lg text-gray-800">or continue with</span>
            </div>
          </div>

          {/* Google Login Button - MODIFIED TO TAKE FULL WIDTH */}
          <div className="w-full">
            <style jsx global>{`
                        /* Force Google button to take full width */
                        [data-credential-picker-container],
                        .google-login-button-container,
                        div[role="button"][aria-label*="Google"] {
                          width: 100% !important;
                          max-width: 100% !important;
                        }
                      `}</style>
            <div className="w-full flex justify-center">
              <div className="w-full" style={{ minWidth: '100%' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="pill"
                  width="100%"
                  containerProps={{
                    style: { width: '100%', minWidth: '100%' }
                  }}
                  locale="en"
                />
              </div>
            </div>
          </div>
      </form>
    </div>
  );
}

export default LoginPage;