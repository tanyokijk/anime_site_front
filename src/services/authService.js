const API_URL = "http://localhost:8000";

export async function getCsrfCookie() {
  try {
    const response = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch CSRF cookie:", response.status);
      throw new Error("Failed to fetch CSRF cookie");
    }

    return true;
  } catch (error) {
    console.error("CSRF cookie error:", error);
    throw error;
  }
}

export async function registerUser(data) {
  try {
    await getCsrfCookie();

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("CSRF token not found");
    }

    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": decodeURIComponent(token),
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    // First check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // If not JSON, get text and throw error with that content
      const errorText = await response.text();
      console.error("Non-JSON response:", errorText);
      throw new Error("Server returned an invalid response format");
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Registration failed");
    }

    return responseData;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginUser(credentials) {
  try {
    await getCsrfCookie();

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("CSRF token not found");
    }

    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": decodeURIComponent(token),
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    // First check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // If not JSON, get text and throw error with that content
      const errorText = await response.text();
      console.error("Non-JSON response:", errorText);
      throw new Error("Server returned an invalid response format");
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Login failed");
    }

    return responseData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_URL}/api/user`, {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response from user endpoint");
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

export async function logoutUser() {
  try {
    await getCsrfCookie();

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("CSRF token not found");
    }

    const response = await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": decodeURIComponent(token),
      },
      credentials: "include",
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Logout failed");
      }
    }

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function forgotPassword(email) {
  try {
    await getCsrfCookie();

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("CSRF token not found");
    }

    const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": decodeURIComponent(token),
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("Non-JSON response:", errorText);
      throw new Error("Server returned an invalid response format");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Не вдалося відправити посилання для відновлення пароля");
    }

    return data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

// Оновлення пароля (reset-password)
export async function resetPassword(email, password, token) {
  try {
    await getCsrfCookie();

    const xsrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (!xsrfToken) {
      throw new Error("CSRF token not found");
    }

    const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
      },
      credentials: "include",
      body: JSON.stringify({ email, password, token }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("Non-JSON response:", errorText);
      throw new Error("Server returned an invalid response format");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Не вдалося оновити пароль");
    }

    return data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}

