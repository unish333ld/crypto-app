import { Card, Col, Layout, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useCrypto } from '../../context/crypto-context';

const money = (value) => `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const percent = (value) => `${value > 0 ? '+' : ''}${Number(value || 0).toFixed(2)}%`;

export default function AppContent() {
  const { crypto, assets } = useCrypto();
  const total = assets.reduce((sum, asset) => sum + asset.totalAmount, 0);
  const profit = assets.reduce((sum, asset) => sum + asset.totalProfit, 0);
  const columns = [{ title: 'Актив', render: (_, coin) => <Space><img className="coin-icon" src={coin.icon} alt="" /><span><Typography.Text strong>{coin.name}</Typography.Text><Typography.Text type="secondary" className="coin-symbol">{coin.symbol}</Typography.Text></span></Space> }, { title: 'Цена', dataIndex: 'price', render: money }, { title: 'Изменение за 24 ч.', dataIndex: 'priceChange1d', render: (value) => <span className={value >= 0 ? 'up' : 'down'}>{value >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {percent(value)}</span> }, { title: 'Капитализация', dataIndex: 'marketCap', render: money }, { title: 'Ранг', dataIndex: 'rank', render: (value) => `#${value}` }];
  return <Layout.Content className="content"><div className="dashboard"><div className="page-heading"><Typography.Text className="eyebrow">Панель управления</Typography.Text><Typography.Title level={1}>Обзор криптопортфеля</Typography.Title><Typography.Paragraph type="secondary">Следите за стоимостью активов и изменениями рынка в одном месте.</Typography.Paragraph></div>
    <Row gutter={[16, 16]} className="metrics"><Col xs={24} sm={12} xl={6}><Card><Statistic title="Стоимость портфеля" value={total} precision={2} prefix="$" /></Card></Col><Col xs={24} sm={12} xl={6}><Card><Statistic title="Общая прибыль" value={profit} precision={2} prefix="$" valueStyle={{ color: profit >= 0 ? '#16855f' : '#c23850' }} /></Card></Col><Col xs={24} sm={12} xl={6}><Card><Statistic title="Изменение за день" value={2.16} precision={2} suffix="%" valueStyle={{ color: '#16855f' }} /></Card></Col><Col xs={24} sm={12} xl={6}><Card><Statistic title="Активов в портфеле" value={assets.length} suffix=" шт." /></Card></Col></Row>
    <section><div className="section-heading"><Typography.Title level={3}>Мой портфель</Typography.Title><Typography.Text type="secondary">{assets.length} позиции</Typography.Text></div><Row gutter={[16, 16]}>{assets.map((asset) => { const coin = crypto.find((item) => item.id === asset.id); return <Col xs={24} sm={12} xl={8} key={asset.id}><Card className="asset-card"><Space align="start"><img className="coin-icon" src={coin?.icon} alt="" /><span><Typography.Text strong>{coin?.name || asset.id}</Typography.Text><Typography.Text type="secondary" className="coin-symbol">{coin?.symbol}</Typography.Text></span><Tag color={asset.grow ? 'success' : 'error'}>{asset.grow ? '+' : '-'}{asset.growPercent}%</Tag></Space><Typography.Title level={3} className="asset-value">{money(asset.totalAmount)}</Typography.Title><FlexLine label={`${asset.amount} ${coin?.symbol || ''}`} value={`${asset.grow ? '+' : ''}${money(asset.totalProfit)}`} positive={asset.grow} /></Card></Col>; })}</Row></section>
    <section><div className="section-heading"><Typography.Title level={3}>Рынок</Typography.Title><Typography.Text type="secondary">Популярные активы</Typography.Text></div><Card bodyStyle={{ padding: 0 }}><Table rowKey="id" columns={columns} dataSource={crypto.slice(0, 8)} pagination={{ pageSize: 5, showSizeChanger: false, responsive: true }} scroll={{ x: 640 }} /></Card></section>
  </div></Layout.Content>;
}

function FlexLine({ label, value, positive }) { return <div className="asset-line"><Typography.Text type="secondary">{label}</Typography.Text><Typography.Text className={positive ? 'up' : 'down'}>{value}</Typography.Text></div>; }
