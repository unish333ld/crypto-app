import AppLayout from './components/layout/AppLayout';
import { CryptoContextProvider } from './context/crypto-context';

const layoutStyle = {
  minHeight: '100vh',
};

export default function App() {
  return (
    <CryptoContextProvider>
      <AppLayout/>
    </CryptoContextProvider>
  );
}