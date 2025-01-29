import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorToast from '../ErrorMessage.jsx';

describe('ErrorToast Component', () => {
  test('renders ErrorToast component correctly when there is an error', () => {
    const errorMessage = "Something went wrong";
    render(<ErrorToast error={errorMessage} />);

    expect(screen.getByText('Error Occurred')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('does not render ErrorToast component when there is no error', () => {
    const { container } = render(<ErrorToast error={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('does not render ErrorToast component when error is dismissed', () => {
    const errorMessage = "Something went wrong";
    render(<ErrorToast error={errorMessage} />);

    fireEvent.click(screen.getByLabelText('Close error message'));
    expect(screen.queryByText('Error Occurred')).not.toBeInTheDocument();
  });

  test('resets visibility on new error input', () => {
    const { rerender } = render(<ErrorToast error="Initial error" />);
    
    expect(screen.getByText('Initial error')).toBeInTheDocument();

    rerender(<ErrorToast error="New error" />);
    
    expect(screen.getByText('New error')).toBeInTheDocument();
  });
});
