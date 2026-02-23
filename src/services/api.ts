const API_BASE_URL = "http://192.168.88.189:8000/api";

const getToken = () => localStorage.getItem("token");

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (response.type === "opaque" || response.redirected) {
    window.location.href = "/login";
    throw new Error("Redirected to login");
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("text/html")) {
      window.location.href = "/login";
      throw new Error("Redirected to login");
    }
    const errorData = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    const message = errorData.message || errorData.error || "An error occurred";
    throw new Error(message);
  }
  return response.json();
};

export const authApi = {
  login: async (name: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: getHeaders(),
    });
    localStorage.removeItem("token");
    return handleResponse(response);
  },

  profile: async () => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const deploymentApi = {
  getCompanies: async () => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createCompany: async (data: {
    company_name: string;
    app_id: number;
    primary_color_light?: string;
    primary_color_dark?: string;
    secondary_color_light?: string;
    secondary_color_dark?: string;
    background_color_light?: string;
    background_color_dark?: string;
    surface_color_light?: string;
    surface_color_dark?: string;
    default_theme_mode?: string;
    logo_url?: string;
    api_endpoint?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getApiKeys: async () => {
    const response = await fetch(`${API_BASE_URL}/api-keys`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  generateApiKey: async (app_name: string, scopes: string[] = []) => {
    const response = await fetch(`${API_BASE_URL}/generate-api-key`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ app_name, scopes }),
    });
    return handleResponse(response);
  },

  deleteApiKey: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api-keys/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getDeployments: async () => {
    const response = await fetch(`${API_BASE_URL}/deployments`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAppConfigs: async () => {
    const response = await fetch(`${API_BASE_URL}/app-configs`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAppConfig: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/app-configs/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createAppConfig: async (data: {
    company_id: number;
    app_id: number;
    primary_color_light?: string;
    primary_color_dark?: string;
    secondary_color_light?: string;
    secondary_color_dark?: string;
    background_color_light?: string;
    background_color_dark?: string;
    surface_color_light?: string;
    surface_color_dark?: string;
    default_theme_mode?: string;
    logo_url?: string;
    api_endpoint?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/app-configs`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateAppConfig: async (
    id: number,
    data: {
      company_id?: number;
      app_id?: number;
      primary_color_light?: string;
      primary_color_dark?: string;
      secondary_color_light?: string;
      secondary_color_dark?: string;
      background_color_light?: string;
      background_color_dark?: string;
      surface_color_light?: string;
      surface_color_dark?: string;
      default_theme_mode?: string;
      logo_url?: string;
      api_endpoint?: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/app-configs/update`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ id, ...data }),
    });
    return handleResponse(response);
  },

  deleteAppConfig: async (id: number, company_id: number, app_id: number) => {
    const response = await fetch(`${API_BASE_URL}/app-configs/delete`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ id, company_id, app_id }),
    });
    return handleResponse(response);
  },
};
