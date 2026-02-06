"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, ArrowRight, Mail } from "lucide-react"; // Added Mail icon
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl } from "@/utils/config";
import LocationModal from "./LocationModal";

export default function SetupAccountModal_mail({ isOpen, setIsOpen }) {
  const router = useRouter();
  const { backendUser, setBackendUser } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Added email state
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Load initial data
  useEffect(() => {
    if (isOpen && backendUser) {
      setName(backendUser.name || "");
      setEmail(backendUser.email || ""); // Pre-fill email
      // Phone should remain empty to force user entry, unless they already had one (unlikely for this flow but possible)
      if (backendUser.phone) setPhone(backendUser.phone.replace("+91", ""));
    }
  }, [isOpen, backendUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!phone || phone.length !== 10) {
      setError("Valid 10-digit phone number is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("yelo_token");
      if (!token) throw new Error("Unauthorized");

      const apiUrl = getApiUrl();
      const res = await fetch(
        `${apiUrl}/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            phone: `+91${phone.replace(/\D/g, "")}`, // Format phone for backend
            isProfileComplete: true // Explicitly mark complete
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update context
      if (setBackendUser) {
        setBackendUser(data.user);
        localStorage.setItem("yelo_backend_user", JSON.stringify(data.user));
      }

      toast.success("Profile completed successfully!");
      
      const hasAddress = data.user?.address && data.user?.city && data.user?.state && data.user?.pincode;
      
      setIsOpen(false);
      
      if (!hasAddress) {
        setShowLocationModal(true);
      } else {
        router.push("/account");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 pt-8 pb-4 bg-gradient-to-r from-yellow-50 to-white">
            <h1 className="text-2xl font-bold text-gray-900">Complete Setup</h1>
            <p className="text-sm text-gray-500 mt-1">
              Please provide your details to continue shopping
            </p>
          </div>

          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-gray-400 text-xs">(verified)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    readOnly
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 text-gray-500 text-sm cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-3.5 flex items-center gap-2 text-gray-500 font-medium">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} // Allow only numbers, max 10
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-gray-300 pl-20 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">We need this for order updates and delivery.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? "Saving..." : "Complete Setup"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      <LocationModal
        isOpen={showLocationModal}
        setIsOpen={(value) => {
          setShowLocationModal(value);
          if (!value) router.push("/account");
        }}
        onSave={() => setTimeout(() => router.push("/account"), 500)}
      />
    </>
  );
}
