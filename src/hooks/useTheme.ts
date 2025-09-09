import { useContext } from 'react';
import { ThemeContext } from '@/core/context';

export const useTheme = () => {
  const context = useContext(ThemeContext);

  return context;
};
