import { Layout, Spin } from 'antd';
import AppHeader from './AppHeader'; import AppSider from './AppSider'; import AppContent from './AppContent';
import { useContext } from 'react'; import CryptoContext from '../../context/crypto-context';
export default function AppLayout() { const { loading } = useContext(CryptoContext); if (loading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#080b18' }}><Spin size="large" /></div>; return <Layout className="app-shell"><AppHeader /><Layout><AppSider /><AppContent /></Layout></Layout>; }
