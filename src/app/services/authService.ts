const authService = {
  isAuthenticated: false,

  login(email: string, password: string): boolean {
    if (email === "user@example.com" && password === "password123") {
      this.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  },

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem("isAuthenticated");
  },

  checkAuth(): boolean {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth === "true";
  },
};

export default authService;
