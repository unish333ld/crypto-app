import { Layout, Menu, Typography } from 'antd';
import { AppstoreOutlined, BarChartOutlined, SettingOutlined, WalletOutlined } from '@ant-design/icons';

const menuItems = [{ key: 'overview', icon: <AppstoreOutlined />, label: 'Обзор' }, { key: 'markets', icon: <BarChartOutlined />, label: 'Рынок' }, { key: 'portfolio', icon: <WalletOutlined />, label: 'Портфель' }, { key: 'settings', icon: <SettingOutlined />, label: 'Настройки' }];

export default function AppSider() { return <Layout.Sider className="side-nav" breakpoint="lg" collapsedWidth="0"><div className="side-heading">Разделы</div><Menu mode="inline" selectedKeys={['overview']} items={menuItems} /><div className="side-note"><Typography.Text strong>Данные обновляются</Typography.Text><Typography.Text type="secondary">Цены загружены из локального набора данных</Typography.Text></div></Layout.Sider>; }
