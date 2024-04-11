import decode from 'jwt-decode';
// AuthService class to handle authentication-related operations.
class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  // check if the user is logged in
  loggedIn() {
    // Check if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); 
  }
// Checks if the given token has expired by comparing the expiration time with the current time.
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }
// Retrieves the JWT token from localStorage.
  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }
 // Saves the user's JWT token in localStorage and redirects to the homepage, effectively logging the user in.
  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
