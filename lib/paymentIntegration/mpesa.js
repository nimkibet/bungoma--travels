// lib/paymentIntegration/mpesa.js

/**
 * Helper to format phone number to Safaricom standard (2547XXXXXXXX or 2541XXXXXXXX)
 * @param {string} phone
 * @returns {string}
 */
export function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, ""); // remove all non-digits
  
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  } else if (cleaned.startsWith("254")) {
    // Already in standard format
  } else if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(1);
  } else {
    // Fallback if it's 9 digits without leading 0
    if (cleaned.length === 9) {
      cleaned = "254" + cleaned;
    }
  }
  return cleaned;
}

/**
 * Gets OAuth Access Token from Safaricom Daraja API
 * @returns {Promise<string>} Access Token
 */
export async function getMpesaAccessToken() {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY || process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET || process.env.MPESA_CONSUMER_SECRET;
  
  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa API credentials (DARAJA_CONSUMER_KEY/SECRET) are missing.");
  }

  const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("[M-Pesa Token Error]", error.message);
    throw new Error("Failed to authenticate with M-Pesa Daraja API: " + error.message);
  }
}

/**
 * Triggers M-Pesa Express STK Push
 * @param {Object} params
 * @param {number} params.amount - amount to charge (KES)
 * @param {string} params.phone - payer phone number (e.g. 254712345678)
 * @param {string} params.reference - Account reference (e.g. Booking code BT-XXXX)
 * @param {string} params.description - Transaction description
 * @returns {Promise<Object>} Daraja API response
 */
export async function initiateStkPush({ amount, phone, reference, description = "Bungoma Tours Booking" }) {
  try {
    const accessToken = await getMpesaAccessToken();
    const shortcode = process.env.DARAJA_BUSINESS_SHORTCODE || process.env.MPESA_SHORTCODE || "174379";
    const passkey = process.env.DARAJA_PASS_KEY || process.env.MPESA_PASSKEY;

    if (!passkey) {
      throw new Error("M-Pesa Passkey is missing.");
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14); // YYYYMMDDHHmmss
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    const formattedPhone = formatPhoneNumber(phone);

    // Dynamic Callback URL fallback to localhost or base URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bungoma-travels.vercel.app";
    if (baseUrl.includes("localhost")) {
      baseUrl = "https://bungoma-travels.vercel.app"; // Daraja API rejects localhost URLs
    }
    const callbackUrl = `${baseUrl}/api/bookings/callback`;

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount), // Daraja expects integer KES in sandbox
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: reference,
      TransactionDesc: description.substring(0, 20),
    };

    console.log("[M-Pesa STK Push Payload]", payload);

    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.errorMessage || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("[M-Pesa STK Push Error]", error.message);
    throw new Error(error.message || "Failed to trigger M-Pesa STK Push.");
  }
}
