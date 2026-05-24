import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import {
  sendRegistrationOTP,
  verifyRegistrationOTP,
  googleLogin,
} from '../Redux/Features/authSlice';
import { IoEye, IoEyeOff } from 'react-icons/io5';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, otpSent, otpVerified, tempEmail, tempName, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('form'); // form | otp | success

  const [otp, setOtp] = useState(Array(6).fill(''));
  const otpInputsRef = useRef([]);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (otpSent) {
      setStep('otp');
      setCanResend(false);
      setResendTimer(60);
      toast.success('OTP sent to your email.');
    }
  }, [otpSent]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Registration successful! Redirecting...');
      setTimeout(() => navigate('/'), 1200);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error('Name is required');
    if (!email.trim() || !validateEmail(email.trim())) return toast.error('Valid email is required');
    if (!password || password.length < 8) return toast.error('Password must be at least 8 characters');

    try {
      await dispatch(sendRegistrationOTP({ name: name.trim(), email: email.trim(), password })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to send OTP');
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < otp.length - 1) otpInputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6).split('');
    if (pasted.length === 0) return;
    setOtp((prev) => pasted.map((d, i) => d || prev[i] || ''));
    const nextIndex = Math.min(pasted.length, 5);
    otpInputsRef.current[nextIndex]?.focus();
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the 6-digit code');

    try {
      await dispatch(verifyRegistrationOTP({ email: tempEmail || email.trim(), otp: code })).unwrap();
      setStep('success');
    } catch (err) {
      toast.error(err || 'Failed to verify OTP');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await dispatch(sendRegistrationOTP({ name: name.trim(), email: tempEmail || email.trim(), password })).unwrap();
      setCanResend(false);
      setResendTimer(60);
      toast.success('OTP resent');
    } catch (err) {
      toast.error(err || 'Failed to resend OTP');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await dispatch(googleLogin({ credential: credentialResponse.credential })).unwrap();
    } catch (err) {
      toast.error(err || 'Google sign-up failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign-up failed. Please try again.');
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8">
      {step === 'form' && (
        <>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" />
            <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              className="input" />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
            >
              <span className="text-xl">{showPassword ? <IoEye /> : <IoEyeOff />}</span>
            </button>
            </div>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button className="rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white" type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Create account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white rounded-lg text-gray-800">or continue with</span>
            </div>
          </div>

          <div className="w-full">
            <div className="w-full flex justify-center">
              <div className="w-full" style={{ minWidth: '100%' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_black"
                  size="large"
                  text="signup_with"
                  shape="pill"
                  width="100%"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'otp' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Verify email</h2>
          <p className="text-sm text-gray-300 mb-4">Enter the 6-digit code sent to <span className="font-medium">{tempEmail || email}</span></p>

          <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (otpInputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={handleOtpPaste}
                className="w-11 h-11 md:w-12 md:h-12 text-center text-xl font-semibold border-2 rounded-xl"
              />
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <button type="button" onClick={handleResend} disabled={!canResend || loading} className="text-primary-1 hover:underline">
              Resend code
            </button>
            {!canResend && <span className="text-gray-500">Resend in {resendTimer}s</span>}
          </div>

          <div className="flex gap-3">
            <button onClick={handleVerifyOTP} className="flex-1 rounded-2xl bg-brand-500 px-5 py-3 font-semibold text-white" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button onClick={() => { setStep('form'); }} className="rounded-2xl border border-white/10 px-5 py-3 text-white">Back</button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-3xl text-green-500"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Registration Successful!</h3>
          <p className="text-sm text-gray-300">You will be redirected shortly.</p>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
