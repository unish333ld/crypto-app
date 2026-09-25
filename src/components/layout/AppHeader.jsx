import { Layout, Select, Space, Button, Modal, Drawer } from 'antd';
import { BellOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useCrypto } from '../../context/crypto-context';
import CoinInfoModal from '../CoinCryptoModel';
import AddAssetForm from '../AddAssetForm';

export default function AppHeader() {
  const [selectOpen, setSelectOpen] = useState(false); const [coin, setCoin] = useState(null); const [drawer, setDrawer] = useState(false); const { crypto } = useCrypto();
  useEffect(() => { const keypress = (event) => { if (event.key === '/' && event.target.tagName !== 'INPUT') { event.preventDefault(); setSelectOpen(true); } }; document.addEventListener('keydown', keypress); return () => document.removeEventListener('keydown', keypress); }, []);
  const handleSelect = (value) => { setCoin(crypto.find((item) => item.id === value)); setSelectOpen(false); };
  return <Layout.Header className="topbar"><div className="brand"><div className="brand-mark">₿</div><div className="brand-name">coin<span>scope</span></div></div><div className="topbar-spacer" />
    <Select className="search-select" showSearch open={selectOpen} onOpenChange={setSelectOpen} onSelect={handleSelect} placeholder={<><SearchOutlined />&nbsp; Search assets&nbsp; <kbd>/</kbd></>} options={crypto.map((item) => ({ label: item.name, value: item.id, icon: item.icon, symbol: item.symbol }))} optionRender={(option) => <Space><img className="coin-icon" src={option.data.icon} alt="" style={{ width: 24, height: 24 }} />{option.data.label}<span className="coin-symbol">{option.data.symbol}</span></Space>} />
    <Button className="primary-btn" icon={<PlusOutlined />} onClick={() => setDrawer(true)}>Add asset</Button><Button type="text" shape="circle" icon={<BellOutlined />} style={{ color: '#aab1cb', fontSize: 17 }} /><div className="profile"><div className="profile-avatar">AK</div><div className="profile-text"><strong>Alex Kim</strong><span>Personal account</span></div></div>
    <Modal open={Boolean(coin)} onCancel={() => setCoin(null)} footer={null} width={470}><CoinInfoModal coin={coin} /></Modal><Drawer width={500} title="Add to portfolio" onClose={() => setDrawer(false)} open={drawer} destroyOnClose><AddAssetForm onClose={() => setDrawer(false)} /></Drawer>
  </Layout.Header>;
}
