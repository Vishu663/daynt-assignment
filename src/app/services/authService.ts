const authService = {
  isAuthenticated: false,
  login(email: string, password: string): boolean {
    if (email === "user@example.com" && password === "password123") {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  },
  logout(): void {
    this.isAuthenticated = false;
  },
};

export default authService;
