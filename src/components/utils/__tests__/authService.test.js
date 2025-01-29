import { setToken, getToken, clearToken, isAuthenticated } from '../../utils/authService.js';

describe('authService', () => {
  const token = 'test-token';

  beforeEach(() => {
    localStorage.clear();
  });

  test('setToken stores the token in localStorage', () => {
    setToken(token);
    expect(localStorage.getItem('token')).toBe(token);
  });

  test('getToken retrieves the token from localStorage', () => {
    localStorage.setItem('token', token);
    expect(getToken()).toBe(token);
  });

  test('clearToken removes the token from localStorage', () => {
    localStorage.setItem('token', token);
    clearToken();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('isAuthenticated returns true if a token exists', () => {
    localStorage.setItem('token', token);
    expect(isAuthenticated()).toBe(true);
  });

  test('isAuthenticated returns false if no token exists', () => {
    expect(isAuthenticated()).toBe(false);
  });
});
