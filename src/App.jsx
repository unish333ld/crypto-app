import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, ConfigProvider, DatePicker, Empty, Flex, Form, InputNumber, Progress, Row, Select, Space, Statistic, Tag, Typography, message } from 'antd';
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { coins, fallbackPrices, fetchCurrentPrices } from './api';

const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function readPositions() {
  try { return JSON.parse(localStorage.getItem('crypto-positions') || '[]'); } catch { return []; }
}

export default function App() {
  const [form] = Form.useForm();
  const [positions, setPositions] = useState(readPositions);
  const [prices, setPrices] = useState(fallbackPrices);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const refreshPrices = async () => {
    setLoading(true);
    try { setPrices(await fetchCurrentPrices()); setApiError(false); } catch { setApiError(true); }
    setLoading(false);
  };

  useEffect(() => {
    const timeout = window.setTimeout(refreshPrices, 0);
    const interval = window.setInterval(refreshPrices, 60000);
    return () => { window.clearTimeout(timeout); window.clearInterval(interval); };
  }, []);

  useEffect(() => { localStorage.setItem('crypto-positions', JSON.stringify(positions)); }, [positions]);

  const totals = useMemo(() => positions.reduce((result, position) => {
    const current = position.amount * (prices[position.coinId]?.usd ?? position.purchasePrice);
    const invested = position.amount * position.purchasePrice;
    return { invested: result.invested + invested, current: result.current + current };
  }, { invested: 0, current: 0 }), [positions, prices]);

  const addPosition = (values) => {
    const coin = coins.find((item) => item.id === values.coinId);
    setPositions((current) => [{ id: `${Date.now()}-${values.coinId}`, coinId: values.coinId, symbol: coin.symbol, name: coin.name, amount: values.amount, purchasePrice: values.purchasePrice, purchasedAt: values.purchasedAt.toISOString() }, ...current]);
    form.resetFields();
    form.setFieldValue('purchasedAt', dayjs());
    message.success('Покупка добавлена');
  };

  const selectCoin = (coinId) => form.setFieldValue('purchasePrice', prices[coinId]?.usd ?? coins.find((coin) => coin.id === coinId)?.price);

  return <ConfigProvider theme={{ token: { colorPrimary: '#2563eb', borderRadius: 10, fontFamily: 'Inter, Arial, sans-serif' } }}><div className="app"><header className="header"><div className="container header-inner"><Flex align="center" gap={10}><div className="logo">C</div><Typography.Text strong className="brand">Crypto Compare</Typography.Text></Flex><Flex align="center" gap={8}><span className={`status-dot ${apiError ? 'offline' : ''}`} /><Typography.Text type="secondary" className="api-status">{apiError ? 'Резервные данные' : 'CoinGecko · онлайн'}</Typography.Text><Button type="text" icon={<ReloadOutlined spin={loading} />} onClick={refreshPrices} aria-label="Обновить цены" /></Flex></div></header>
    <main className="container main"><section className="intro"><Typography.Title level={1}>Сколько стоит ваша покупка сейчас?</Typography.Title><Typography.Paragraph type="secondary">Укажите данные покупки. Мы сравним их с актуальной ценой и покажем результат.</Typography.Paragraph></section>
      {apiError && <Alert type="warning" showIcon message="Не удалось обновить котировки" description="Показаны последние доступные данные. Попробуйте обновить цены позже." />}
      <Card className="form-card"><Form form={form} layout="vertical" onFinish={addPosition} initialValues={{ purchasedAt: dayjs() }} requiredMark={false}><Row gutter={[16, 0]} align="bottom"><Col xs={24} md={12} lg={6}><Form.Item label="Валюта" name="coinId" rules={[{ required: true, message: 'Выберите валюту' }]}><Select showSearch placeholder="Например, Bitcoin" onChange={selectCoin} optionFilterProp="label" options={coins.map((coin) => ({ value: coin.id, label: `${coin.name} · ${coin.symbol}` }))} /></Form.Item></Col><Col xs={24} sm={12} lg={5}><Form.Item label="Количество" name="amount" rules={[{ required: true, message: 'Укажите количество' }]}><InputNumber min={0.00000001} precision={8} placeholder="0.00" /></Form.Item></Col><Col xs={24} sm={12} lg={5}><Form.Item label="Цена покупки" name="purchasePrice" rules={[{ required: true, message: 'Укажите цену' }]}><InputNumber min={0.00000001} precision={8} prefix="$" placeholder="0.00" /></Form.Item></Col><Col xs={24} md={12} lg={5}><Form.Item label="Дата и время" name="purchasedAt" rules={[{ required: true, message: 'Укажите дату' }]}><DatePicker showTime format="DD.MM.YYYY HH:mm" allowClear={false} /></Form.Item></Col><Col xs={24} md={12} lg={3}><Form.Item><Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>Добавить</Button></Form.Item></Col></Row></Form></Card>
      {positions.length > 0 && <Row gutter={[16, 16]} className="summary"><Col xs={24} sm={8}><Card><Statistic title="Вложено" value={totals.invested} precision={2} prefix="$" /></Card></Col><Col xs={24} sm={8}><Card><Statistic title="Стоимость сейчас" value={totals.current} precision={2} prefix="$" /></Card></Col><Col xs={24} sm={8}><Card><Statistic title="Результат" value={totals.current - totals.invested} precision={2} prefix="$" valueStyle={{ color: totals.current >= totals.invested ? '#16855f' : '#c23850' }} /></Card></Col></Row>}
      <section className="results"><Flex justify="space-between" align="center"><Typography.Title level={2}>Покупки</Typography.Title>{positions.length > 0 && <Typography.Text type="secondary">{positions.length} шт.</Typography.Text>}</Flex>{positions.length === 0 ? <Card><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Добавьте первую покупку, чтобы увидеть сравнение" /></Card> : <div className="position-list">{positions.map((position) => <PositionCard key={position.id} position={position} quote={prices[position.coinId]} onDelete={() => setPositions((current) => current.filter((item) => item.id !== position.id))} />)}</div>}</section>
    </main></div></ConfigProvider>;
}

function PositionCard({ position, quote, onDelete }) {
  const currentPrice = quote?.usd ?? position.purchasePrice;
  const invested = position.amount * position.purchasePrice;
  const current = position.amount * currentPrice;
  const profit = current - invested;
  const change = invested ? (profit / invested) * 100 : 0;
  const scale = Math.max(invested, current, 1);
  return <Card className="position-card"><Flex justify="space-between" align="start" gap={16}><div><Space><span className="coin-badge">{position.symbol.slice(0, 1)}</span><div><Typography.Title level={3}>{position.name}</Typography.Title><Typography.Text type="secondary">{position.amount} {position.symbol} · {dayjs(position.purchasedAt).format('DD.MM.YYYY HH:mm')}</Typography.Text></div></Space></div><Button type="text" danger icon={<DeleteOutlined />} onClick={onDelete} aria-label="Удалить покупку" /></Flex><Row gutter={[24, 20]} className="position-body"><Col xs={24} lg={14}><div className="comparison"><CompareBar label="При покупке" value={invested} percent={(invested / scale) * 100} color="#94a3b8" /><CompareBar label="Сейчас" value={current} percent={(current / scale) * 100} color={profit >= 0 ? '#16a36f' : '#e14d64'} /></div></Col><Col xs={24} lg={10}><Row gutter={[12, 16]}><Col span={12}><Statistic title="Текущая цена" value={currentPrice} precision={currentPrice < 1 ? 5 : 2} prefix="$" /></Col><Col span={12}><Statistic title="Прибыль / убыток" value={profit} precision={2} prefix="$" valueStyle={{ color: profit >= 0 ? '#16855f' : '#c23850' }} /></Col></Row><Tag color={profit >= 0 ? 'success' : 'error'}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</Tag>{quote?.change != null && <Typography.Text type="secondary" className="day-change">За 24 часа: {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}%</Typography.Text>}</Col></Row></Card>;
}

function CompareBar({ label, value, percent, color }) { return <div className="compare-row"><Flex justify="space-between"><Typography.Text>{label}</Typography.Text><Typography.Text strong>{formatMoney(value)}</Typography.Text></Flex><Progress percent={percent} showInfo={false} strokeColor={color} trailColor="#edf1f6" strokeWidth={14} /></div>; }
