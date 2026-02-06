"use client";

import { useState, useRef } from "react";
import { X, Mail, Shield, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SetupAccountModal_mail from "./SetupAccountModal_mail";
import LocationModal from "./LocationModal";
import { mailAuthAPI } from "@/utils/api_mail";

export default function LoginModal_mail({ isOpen, setIsOpen }) {
  const router = useRouter();
  const { setBackendUser } = useAuth(); // We only need setBackendUser to update context after login

  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const otpLock = useRef(false);

  // Allow closing modal
  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  /* SEND OTP */
  const handleSendOtp = async () => {
    if (loading || otpLock.current) return;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Enter a valid email address");
      return;
    }

    try {
      otpLock.current = true;
      setLoading(true);

      // Show initial feedback
      toast.loading("Sending OTP...", {
        id: "sending-otp",
        duration: 10000,
      });

      await mailAuthAPI.requestOTP(email);

      // Dismiss loading toast and show success
      toast.dismiss("sending-otp");
      toast.success("OTP sent successfully! Check your email.");
      setStep("OTP");
    } catch (err) {
      console.error(err);
      
      // Dismiss loading toast
      toast.dismiss("sending-otp");
      toast.error(err.message || "Failed to send OTP. Please try again.");
      
      otpLock.current = false;
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */
  const handleVerifyOtp = async () => {
    if (loading) return;

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      // Verify OTP with Backend
      const data = await mailAuthAPI.verifyOTP(email, otp);

      // Save token
      if (data.token) {
        localStorage.setItem("yelo_token", data.token);
        // Dispatch event for other components to know token changed
        window.dispatchEvent(new Event("storage"));
      }

      // Update User Context
      if (data.user) {
        setBackendUser(data.user);
        localStorage.setItem("yelo_backend_user", JSON.stringify(data.user));
      }

      toast.success("Login successful!");

      // Check if user has address
      const hasAddress = data.user?.address && data.user?.city && data.user?.state && data.user?.pincode;

      // If profile is complete (has phone number)
      if (data.isProfileComplete) {
        setIsOpen(false);
        // If no address, show location modal first
        if (!hasAddress) {
          setShowLocationModal(true);
        } else {
          router.push("/account");
        }
      } else {
        // If profile incomplete (missing phone), show setup modal immediately
        sessionStorage.setItem("isNewSignup", "true");
        setIsOpen(false);
        setShowSetupModal(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl relative animate-slide-up">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>


        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === "EMAIL" ? "Welcome Back" : "Verify Email"}
              </h2>
              <p className="text-sm text-gray-500">
                {step === "EMAIL"
                  ? "Enter your email to continue"
                  : `OTP sent to ${email}`}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-8">
          {step === "EMAIL" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 pl-12 py-3.5 text-black focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By continuing, you agree to our Terms & Conditions
              </p>
            </>
          )}

          {step === "OTP" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-center text-2xl tracking-widest text-black focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all"
                  placeholder="000000"
                  autoFocus
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Didn't receive? Check your email including spam folder
                </p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setStep("EMAIL");
                  setOtp("");
                  otpLock.current = false;
                }}
                className="w-full text-sm text-gray-600 mt-4 hover:text-gray-900 transition-colors"
              >
                ← Change email address
              </button>
            </>
          )}
        </div>
      </div>
      </div>
      
      {/* Setup Account Email Modal */}
      <SetupAccountModal_mail
        isOpen={showSetupModal} 
        setIsOpen={setShowSetupModal} 
      />
      
      {/* Location Modal - shown after login if no address */}
      <LocationModal
        isOpen={showLocationModal}
        setIsOpen={(value) => {
          setShowLocationModal(value);
          if (!value) {
            router.push("/account");
          }
        }}
        onSave={(user) => {
          setTimeout(() => {
            router.push("/account");
          }, 500);
        }}
      />
    </>
  );
}
