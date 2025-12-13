'use client';
import store from './store';
import { Provider } from 'react-redux';

const provider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default provider;
