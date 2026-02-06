import apiFetch from "./api";

export const mailAuthAPI = {
  requestOTP: async (email) => {
    return apiFetch("/auth/mail/request-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyOTP: async (email, otp) => {
    return apiFetch("/auth/mail/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },
};
