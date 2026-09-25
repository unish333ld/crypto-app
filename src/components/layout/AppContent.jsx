import { Layout, Table, Tag, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, RiseOutlined } from '@ant-design/icons';
import { useCrypto } from '../../context/crypto-context';

const money = (value) => `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const percent = (value) => `${value > 0 ? '+' : ''}${Number(value || 0).toFixed(2)}%`;

export default function AppContent() {
  const { crypto, assets } = useCrypto();
  const total = assets.reduce((sum, asset) => sum + asset.totalAmount, 0);
  const profit = assets.reduce((sum, asset) => sum + asset.totalProfit, 0);
  const tableData = crypto.slice(0, 8).map((coin) => ({ ...coin, key: coin.id }));
  const columns = [
    { title: 'Asset', dataIndex: 'name', key: 'name', render: (_, coin) => <div className="coin-line"><img className="coin-icon" src={coin.icon} alt="" /><div><span className="coin-name">{coin.name}</span><span className="coin-symbol">{coin.symbol}</span></div></div> },
    { title: 'Price', dataIndex: 'price', key: 'price', render: money },
    { title: '1D change', dataIndex: 'priceChange1d', key: 'change', render: (value) => <span className={value >= 0 ? 'up' : 'down'}>{value >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {percent(value)}</span> },
    { title: 'Market cap', dataIndex: 'marketCap', key: 'cap', render: money },
    { title: 'Rank', dataIndex: 'rank', key: 'rank', render: (value) => <Typography.Text type="secondary">#{value}</Typography.Text> },
  ];
  return <Layout.Content><main className="dashboard"><div className="hero"><div><div className="eyebrow">Thursday, 25 September 2026</div><h1 className="page-title">Good morning, Alex <span style={{ color: '#8675ff' }}>✦</span></h1><p className="page-subtitle">Here’s what is happening with your crypto portfolio today.</p></div><div className="hero-actions"><button className="secondary-btn">Last 30 days⌄</button></div></div>
    <section className="metric-grid"><Metric label="Portfolio value" value={money(total)} meta="+12.84% this month" up /><Metric label="Total profit" value={money(profit)} meta="+$1,240.80 all time" up /><Metric label="Today's change" value="+$284.32" meta="+2.16% vs yesterday" up /><Metric label="Assets tracked" value={assets.length} meta="3 active positions" /></section>
    <div className="section-heading"><h2>Your portfolio</h2><span>Updated just now <RiseOutlined /></span></div><section className="asset-list">{assets.map((asset) => { const coin = crypto.find((item) => item.id === asset.id); return <article className="asset-card" key={asset.id}><div className="coin-line"><img className="coin-icon" src={coin?.icon} alt="" /><div><span className="coin-name">{coin?.name || asset.id}</span><span className="coin-symbol">{coin?.symbol}</span></div><Tag color={asset.grow ? 'green' : 'red'} style={{ marginLeft: 'auto', border: 0, background: 'transparent' }}>{asset.grow ? '+' : '-'}{asset.growPercent}%</Tag></div><div className="asset-number">{money(asset.totalAmount)}</div><div className="asset-details"><span>{asset.amount} {coin?.symbol}</span><strong className={asset.grow ? 'up' : 'down'}>{asset.grow ? '+' : ''}{money(asset.totalProfit)}</strong></div></article>; })}</section>
    <div className="section-heading"><h2>Market overview</h2><span>Top assets by market cap</span></div><section className="panel table-panel"><Table className="market-table" columns={columns} dataSource={tableData} pagination={{ pageSize: 5, showSizeChanger: false }} /></section>
  </main></Layout.Content>;
}

function Metric({ label, value, meta, up }) { return <article className="metric-card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className={`metric-meta ${up ? 'up' : ''}`}>{up ? '↗ ' : '• '}{meta}</div></article>; }
