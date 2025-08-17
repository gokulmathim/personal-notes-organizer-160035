const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

/**
 * Returns the auth token from localStorage.
 */
function getToken() {
  try {
    return localStorage.getItem("notes_token") || "";
  } catch {
    return "";
  }
}

/**
 * Low-level request helper using fetch. Automatically attaches JSON headers and authorization if available.
 * Throws an Error with message and optional status when response is not ok.
 */
async function request(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path}`;
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  if (auth) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);
  const contentType = res.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.payload = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Authenticate user and return token and user profile. */
  // Assumes backend endpoint: POST /auth/login {email, password}
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

// PUBLIC_INTERFACE
export async function signup(name, email, password) {
  /** Create a new user account and return token and user profile. */
  // Assumes backend endpoint: POST /auth/signup {name, email, password}
  return request("/auth/signup", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
}

// PUBLIC_INTERFACE
export async function getProfile() {
  /** Fetch authenticated user's profile. */
  // Assumes backend endpoint: GET /auth/me
  return request("/auth/me", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getNotes({ search = "", tags = [], category = "" } = {}) {
  /** Fetch list of notes filtered by optional search, tags, and category. */
  // Assumes backend endpoint: GET /notes?search=&tags=a,b&category=
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (tags.length) params.set("tags", tags.join(","));
  if (category) params.set("category", category);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return request(`/notes${qs}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Fetch a single note by id. */
  return request(`/notes/${encodeURIComponent(id)}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createNote({ title, content, tags = [], category = "" }) {
  /** Create a new note. */
  // Assumes backend endpoint: POST /notes
  return request("/notes", {
    method: "POST",
    body: { title, content, tags, category },
  });
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content, tags = [], category = "" }) {
  /** Update an existing note by id. */
  // Assumes backend endpoint: PUT /notes/:id
  return request(`/notes/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: { title, content, tags, category },
  });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  // Assumes backend endpoint: DELETE /notes/:id
  return request(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// PUBLIC_INTERFACE
export async function getTags() {
  /** Fetch available tags. */
  // Assumes backend endpoint: GET /tags
  return request("/tags", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getCategories() {
  /** Fetch available categories. */
  // Assumes backend endpoint: GET /categories
  return request("/categories", { method: "GET" });
}
