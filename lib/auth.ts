const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "acts2024",
}

export function validateCredentials(username: string, password: string): boolean {
    return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function setAuthToken(): void {
    if (typeof window !== "undefined") {
        localStorage.setItem("acts_admin_token", "authenticated")
    }
}

export function getAuthToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("acts_admin_token")
    }
    return null
}

export function removeAuthToken(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem("acts_admin_token")
    }
}

export function isAuthenticated(): boolean {
    return getAuthToken() === "authenticated"
}
