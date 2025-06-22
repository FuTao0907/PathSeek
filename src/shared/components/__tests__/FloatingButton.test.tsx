import React from 'react';
import { render, screen } from '@testing-library/react';

// 简单的示例测试
describe('Example Test', () => {
  it('should pass basic test', () => {
    render(<div data-testid="test-element">Hello World</div>);
    expect(screen.getByTestId('test-element')).toBeInTheDocument();
  });

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });
});
