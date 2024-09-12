const TOKEN_KEY = "@TOKEN_KEY";

class LocalStorageKit {
  static token = null;

  static setToken(token) {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
  }

  static getToken() {
    if (this.token) {
      return this.token;
    }
    this.token = localStorage.getItem(TOKEN_KEY);
    return this.token;
  }

  static removeToken() {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
  }
}

export default LocalStorageKit;
