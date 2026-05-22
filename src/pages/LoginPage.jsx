import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {
  login,
  forgotPassword,
  resetPassword,
  googleLogin
} from '../Redux/Features/authSlice';
import { toast } from 'react-toastify';
// import { loginUser } from '../store/slices/authSlice.js';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const otpInputsRef = useRef([]);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [googleToastShown, setGoogleToastShown] = useState(false); // Track if Google toast has been shown

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error,
    otpSent,
    tempEmail,
    isAuthenticated
  } = useSelector((state) => state.auth);

  const authError = error;

  const submit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (!email.trim() || !password.trim()) {
      setErrors({ form: 'Email and password are required.' });
      return;
    }

    try {
      await dispatch(login({ email: email.trim(), password: password.trim() })).unwrap();
    } catch (err) {
      toast.error(err || 'Login failed. Please check your credentials.');
    }
  };

  const resetForgotPasswordState = () => {
    setForgotEmail('');
    setOtp(Array(6).fill(''));
    setNewPassword('');
    setConfirmNewPassword('');
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setErrors({});
    setResendTimer(0);
    setCanResend(true);
  };

  const handleBackFromForgot = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep('email');
    resetForgotPasswordState();
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (!forgotEmail.trim()) {
      setErrors({ forgot: 'Please enter your email address.' });
      return;
    }

    if (!validateEmail(forgotEmail.trim())) {
      setErrors({ forgot: 'Please enter a valid email address.' });
      return;
    }

    try {
      await dispatch(forgotPassword(forgotEmail.trim())).unwrap();
      setForgotPasswordStep('otp');
      setCanResend(false);
      setResendTimer(60);
      toast.success('OTP sent to your email.');
    } catch (err) {
      setErrors({ forgot: err || 'Failed to send OTP. Please try again.' });
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < otp.length - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData('Text')
      .replace(/\D/g, '')
      .slice(0, otp.length)
      .split('');

    if (pastedDigits.length === 0) return;

    setOtp((prev) => {
      const next = [...prev];
      for (let i = 0; i < otp.length; i += 1) {
        next[i] = pastedDigits[i] || '';
      }
      return next;
    });

    const nextIndex = Math.min(pastedDigits.length, otp.length - 1);
    otpInputsRef.current[nextIndex]?.focus();
  };

  const handleVerifyForgotOTP = () => {
    setErrors({});

    if (otp.some((digit) => !digit)) {
      setErrors({ otp: 'Please enter the complete 6-digit code.' });
      return;
    }

    setForgotPasswordStep('newPassword');
  };

  const handleResetPassword = async () => {
    setErrors({});

    if (!newPassword) {
      setErrors({ newPassword: 'Please enter a new password.' });
      return;
    }

    if (newPassword.length < 8) {
      setErrors({ newPassword: 'Password must be at least 8 characters.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrors({ confirmNewPassword: 'Passwords do not match.' });
      return;
    }

    try {
      await dispatch(resetPassword({
        email: forgotEmail.trim(),
        otp: otp.join(''),
        newPassword
      })).unwrap();

      setForgotPasswordStep('success');
      toast.success('Password reset successful. Redirecting to login...');
      setTimeout(() => {
        resetForgotPasswordState();
        setShowForgotPassword(false);
        setForgotPasswordStep('email');
      }, 2000);
    } catch (err) {
      setErrors({ reset: err || 'Failed to reset password. Please try again.' });
    }
  };

  const handleResendOTP = async () => {
    if (!forgotEmail.trim()) {
      setErrors({ forgot: 'Please enter your email address first.' });
      return;
    }

    if (!canResend || loading) {
      return;
    }

    try {
      await dispatch(forgotPassword(forgotEmail.trim())).unwrap();
      setCanResend(false);
      setResendTimer(60);
      toast.success('OTP resent to your email.');
    } catch (err) {
      setErrors({ forgot: err || 'Failed to resend OTP. Please try again.' });
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowNewPassword((prev) => !prev);
    } else if (field === 'confirmNew') {
      setShowConfirmNewPassword((prev) => !prev);
    }
  };

  const calculatePasswordScore = (passwordValue) => {
    let score = 0;
    if (passwordValue.length >= 8) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[a-z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    return Math.min(score, 4);
  };

  const getStrengthColor = (passwordValue) => {
    const score = calculatePasswordScore(passwordValue);
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-yellow-400';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (passwordValue) => {
    const score = calculatePasswordScore(passwordValue);
    if (score <= 1) return 'Very weak';
    if (score === 2) return 'Weak';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendTimer]);

   // Render forgot password flow
  const renderForgotPassword = () => {
    switch(forgotPasswordStep) {
      case 'email':
        return (
          <div className="flex-1 flex flex-col justify-center">
            <button
              onClick={handleBackFromForgot}
              className="text-primary-1 mb-4 md:mb-6 flex items-center gap-2 hover:gap-3 transition-all text-sm md:text-base"
              disabled={loading}
            >
              <i className="fas fa-arrow-left"></i>
              Back to login
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Enter your email address and we'll send you an OTP.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  disabled={loading}
                  className={`w-full px-4 py-2.5 md:py-3 border-2 rounded-xl focus:outline-none transition-colors text-sm md:text-base ${
                    errors.forgot ? 'border-red-400' : 'border-gray-200 focus:border-primary-1'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {errors.forgot && (
                  <p className="text-red-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.forgot}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-1 text-white py-2.5 md:py-3 rounded-xl font-semibold hover:bg-primary-1/90 transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          </div>
        );

      case 'otp':
        return (
          <div className="flex-1 flex flex-col justify-center">
            <button
              onClick={() => setForgotPasswordStep('email')}
              className="text-primary-1 mb-6 flex items-center gap-2 hover:gap-3 transition-all"
            >
              <i className="fas fa-arrow-left"></i>
              Back
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-1/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-3xl text-primary-1"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
              <p className="text-gray-600">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-primary-1">{forgotEmail}</span>
              </p>
            </div>

            {/* OTP Input Grid */}
            <div className="flex justify-between gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  disabled={loading}
                  className={`w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-semibold 
                    border-2 rounded-xl focus:border-primary-1 focus:outline-none transition-all
                    ${authError || errors.otp ? 'border-red-400' : 'border-gray-200'}
                    ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}
                    ${digit ? 'bg-primary-1/5 border-primary-1' : ''}`}
                />
              ))}
            </div>

            {/* Resend Section */}
            <div className="flex items-center justify-between text-sm mb-6">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || loading}
                className={`text-primary-1 hover:underline transition-all flex items-center gap-1
                  ${(!canResend || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <i className="fas fa-redo-alt text-xs"></i>
                Resend Code
              </button>
              {!canResend && (
                <span className="text-gray-500">
                  Resend in <span className="font-semibold text-primary-1">{resendTimer}s</span>
                </span>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyForgotOTP}
              disabled={loading || otp.some(digit => !digit)}
              className="w-full bg-primary-1 text-white py-3 rounded-xl font-semibold hover:bg-primary-1/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>
        );

      case 'newPassword':
        return (
          <div className="flex-1 flex flex-col justify-center">
            <button
              onClick={() => setForgotPasswordStep('otp')}
              className="text-primary-1 mb-6 flex items-center gap-2 hover:gap-3 transition-all"
            >
              <i className="fas fa-arrow-left"></i>
              Back
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Set New Password</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Enter your new password below.
            </p>

            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-colors text-sm pr-12 ${
                      errors.newPassword ? 'border-red-400' : 'border-gray-200 focus:border-primary-1'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-1 focus:outline-none"
                  >
                    <span className="text-lg">{showNewPassword ? '👁️' : '🙈'}</span>
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor(newPassword)} transition-all duration-300`}
                          style={{ width: `${(calculatePasswordScore(newPassword) / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {getStrengthText(newPassword)}
                      </span>
                    </div>
                  </div>
                )}
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={loading}
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-colors text-sm pr-12 ${
                      errors.confirmNewPassword ? 'border-red-400' : 'border-gray-200 focus:border-primary-1'
                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmNew')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-1 focus:outline-none"
                  >
                    <span className="text-lg">{showConfirmNewPassword ? '👁️' : '🙈'}</span>
                  </button>
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.confirmNewPassword}
                  </p>
                )}
              </div>

              {errors.reset && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.reset}
                </p>
              )}

              <button
                onClick={handleResetPassword}
                disabled={loading || !newPassword || !confirmNewPassword}
                className="w-full bg-primary-1 text-white py-2.5 rounded-xl font-semibold hover:bg-primary-1/90 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <i className="fas fa-check-circle text-3xl md:text-4xl text-green-500"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h3>
            <p className="text-sm md:text-base text-gray-600">
              Your password has been reset successfully.<br />
              Redirecting to login...
            </p>
          </div>
        );

      default:
        return null;
    }
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
      {showForgotPassword ? (
        renderForgotPassword()
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white">Sign in</h1>
          
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="input" />
            <div className="relative">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                className="input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              >
                <span className="text-xl">{showPassword ? '👁️' : '🙈'}</span>
              </button>
            </div>
            {(errors.form || authError) ? (
              <p className="text-sm text-red-300">{errors.form || authError}</p>
            ) : null}
            <button className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded w-4 h-4 accent-primary-1"
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
        </>
      )}
    </div>
  );
}

export default LoginPage;