import { Layout, Spin } from 'antd';
import AppHeader from './AppHeader';
import AppSider from './AppSider';
import AppContent from './AppContent';
import { useContext } from 'react';
import CryptoContext from '../../context/crypto-context';

const layoutStyle = {
  minHeight: '100vh',
};

export default function AppLayout(){
    const { loading } = useContext(CryptoContext)

    if(loading){
  return  <Spin fullscreen />
}

    return(
    <Layout style={layoutStyle}>
        <AppHeader/>
          <Layout>
            <AppContent/>
          <AppSider/>
        </Layout>
    </Layout>
      )
    
}