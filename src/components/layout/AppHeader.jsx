import { Button, Drawer, Flex, Input, Layout, Modal, Select, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useCrypto } from '../../context/crypto-context';
import AddAssetForm from '../AddAssetForm';
import CoinInfoModal from '../CoinCryptoModel';

export default function AppHeader() {
  const { crypto } = useCrypto();
  const [coin, setCoin] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  return <Layout.Header className="topbar">
    <Flex className="brand" align="center" gap={10}><div className="brand-mark">C</div><div className="brand-name">Crypto<span>scope</span></div></Flex>
    <div className="topbar-search"><Select showSearch allowClear prefix={<SearchOutlined />} placeholder="Найти монету" options={crypto.map((item) => ({ label: item.name, value: item.id, icon: item.icon, symbol: item.symbol }))} onSelect={(value) => setCoin(crypto.find((item) => item.id === value))} optionRender={(option) => <Space><img className="coin-icon small" src={option.data.icon} alt="" />{option.data.label}<span className="coin-symbol">{option.data.symbol}</span></Space>} /></div>
    <Flex className="topbar-actions" gap={10}><Button icon={<PlusOutlined />} type="primary" onClick={() => setDrawerOpen(true)}>Добавить актив</Button><Input className="desktop-date" value="USD · 25.09.2026" readOnly /></Flex>
    <Modal open={Boolean(coin)} onCancel={() => setCoin(null)} footer={null} width={470}><CoinInfoModal coin={coin} /></Modal><Drawer title="Добавить актив" open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose width={500}><AddAssetForm onClose={() => setDrawerOpen(false)} /></Drawer>
  </Layout.Header>;
}
