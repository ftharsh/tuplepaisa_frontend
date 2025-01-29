import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthPage from '../Authpage';
import { MemoryRouter } from 'react-router-dom';
import { setToken } from '../utils/authService';

jest.mock('axios');
jest.mock('../utils/authService.js', () => ({
  setToken: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('AuthPage Component', () => {
  const setUp = () => {
    return render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
  };

  test('renders AuthPage component', () => {
    setUp();
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sign in/i).length).toBeGreaterThan(0);
  });

  test('submits login form successfully', async () => {
    axios.post.mockResolvedValue({
      data: {
        token: 'fakeToken',
        email: 'test@example.com',
      },
    });
  
    setUp();
  
    const signInForm = screen
      .getByText(/Welcome back to your digital home!/)
      .closest('form');
    const usernameInput = within(signInForm).getByPlaceholderText('Username');
    const passwordInput = within(signInForm).getByPlaceholderText('Password');
  
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(within(signInForm).getByRole('button', { name: /Sign In/i }));
  
    await waitFor(() => {
      expect(setToken).toHaveBeenCalledWith('fakeToken');
      expect(localStorage.getItem('username')).toBe('testuser');
      expect(localStorage.getItem('email')).toBe('test@example.com');
    });
  });
  

  test('handles input changes', () => {
    setUp();

    const signInForm = screen.getByText(/Welcome back to your digital home!/).closest('form');
    const usernameInput = within(signInForm).getByPlaceholderText('Username');
    const passwordInput = within(signInForm).getByPlaceholderText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password');
  });

  test('toggles between sign-in and sign-up forms', () => {
    setUp();

    const signUpButton = screen.getAllByText(/Sign Up/i)[1];
    const signInButton = screen.getAllByText(/Sign In/i)[1];

    expect(screen.getByText(/Welcome back to your digital home/i)).toBeInTheDocument();

    fireEvent.click(signUpButton);
    expect(screen.getByText(/Join our community and start your journey/i)).toBeInTheDocument();

    fireEvent.click(signInButton);
    expect(screen.getByText(/Welcome back to your digital home/i)).toBeInTheDocument();
  });



  test('submits registration form successfully', async () => {
    axios.post.mockResolvedValue({ data: {} });
    setUp();

    const signUpButton = screen.getAllByText(/Sign Up/i)[1];
    fireEvent.click(signUpButton);

    const signUpForm = screen.getByText(/Join our community and start your journey!/).closest('form');
    const usernameInput = within(signUpForm).getByPlaceholderText('Username');
    const emailInput = within(signUpForm).getByPlaceholderText('Email');
    const passwordInput = within(signUpForm).getByPlaceholderText('Password');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(within(signUpForm).getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/user/register', {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password',
      });
      expect(screen.getByText(/Registration successful! Please login/i)).toBeInTheDocument();
    });
  });

  test('handles error messages', async () => {
    axios.post.mockRejectedValue({ response: { data: 'Login failed' } });
    setUp();

    const signInForm = screen.getByText(/Welcome back to your digital home!/).closest('form');
    const usernameInput = within(signInForm).getByPlaceholderText('Username');
    const passwordInput = within(signInForm).getByPlaceholderText('Password');
    const signInButton = within(signInForm).getByRole('button', { name: /Sign In/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });
 

  test('handles network error during login', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    setUp();

    const signInForm = screen.getByText(/Welcome back to your digital home!/).closest('form');
    const usernameInput = within(signInForm).getByPlaceholderText('Username');
    const passwordInput = within(signInForm).getByPlaceholderText('Password');
    const signInButton = within(signInForm).getByRole('button', { name: /Sign In/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    });
  });
   test('handles registration without email from response', async () => {
    const navigateMock = jest.fn();
    axios.post.mockResolvedValue({ data: {} });

    setUp(navigateMock);

    const signUpButton = screen.getAllByText(/Sign Up/i)[1];
    fireEvent.click(signUpButton);

    const signUpForm = screen.getByText(/Join our community and start your journey!/).closest('form');
    const usernameInput = within(signUpForm).getByPlaceholderText('Username');
    const emailInput = within(signUpForm).getByPlaceholderText('Email');
    const passwordInput = within(signUpForm).getByPlaceholderText('Password');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(within(signUpForm).getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(localStorage.getItem('username')).toBe('newuser');
      expect(localStorage.getItem('email')).toBe('newuser@example.com');
      expect(screen.getByText(/Registration successful! Please login/i)).toBeInTheDocument();
    });
  });
  
});
