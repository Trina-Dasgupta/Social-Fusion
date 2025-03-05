export const setAuthCookie = (token: string) => {
    document.cookie = `token=${token}; path=/; Secure; HttpOnly; SameSite=Strict`;
  };
  