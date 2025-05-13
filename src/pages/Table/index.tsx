import { Spin, Table, Typography, Button, Drawer } from "antd";
import { useState } from "react";
import type { TableColumnsType } from "antd";
import { useQuery } from "@tanstack/react-query";
import { LoadingOutlined } from "@ant-design/icons";
import { CryptoDataType } from "./types";
import { fetchData, transformData } from "./functions";
import styles from "./Table.module.css";
import Chat from "../Chat";
import SparklineChart from "../../components/SparklineChart";

const { Text } = Typography;

const columns: TableColumnsType<CryptoDataType> = [
  {
    title: "№",
    dataIndex: "key",
    key: "key",
    width: 60,
    sorter: {
      compare: (a, b) => a.key.localeCompare(b.key),
      multiple: 5,
    },
    render: (_, __, index) => (
        <Text style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
          {index + 1}
        </Text>
    ),
  },
  {
    title: "Логотип",
    dataIndex: "logo",
    key: "logo",
    width: 80,
    render: (logo: string) => (
        <img
            src={logo}
            alt="Logo"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              objectFit: "cover",
              imageRendering: "pixelated"
            }}
        />
    ),
  },
  {
    title: "Название",
    dataIndex: "name",
    key: "name",
    width: 150,
    render: (name: string, record) => (
        <div style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
          <Text strong style={{ color: '#ff9e00' }}>{name}</Text>
          <br />
          <Text type="secondary" style={{ color: '#2bff00' }}>{record.symbol}</Text>
        </div>
    ),
  },
  {
    title: "Цена",
    dataIndex: "price",
    key: "price",
    width: 120,
    sorter: {
      compare: (a, b) => {
        const numA = parseFloat(a.price.replace('$', ''));
        const numB = parseFloat(b.price.replace('$', ''));
        return numA - numB;
      },
      multiple: 4,
    },
    render: (price: string) => (
        <Text strong style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
          {price}
        </Text>
    ),
  },
  {
    title: "24ч",
    dataIndex: "priceChange",
    key: "priceChange",
    width: 100,
    sorter: {
      compare: (a, b) => {
        const numA = parseFloat(a.priceChange.replace('%', ''));
        const numB = parseFloat(b.priceChange.replace('%', ''));
        return numA - numB;
      },
      multiple: 3,
    },
    render: (text: string) => {
      const change = parseFloat(text.replace('%', ''));
      const color = change >= 0 ? '#16c784' : '#ea3943';
      return (
          <Text
              strong
              style={{
                color,
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '10px'
              }}
          >
            {change >= 0 ? '+' : ''}{text}
          </Text>
      );
    },
  },
  {
    title: "Капитализация",
    dataIndex: "marketCap",
    key: "marketCap",
    width: 150,
    sorter: {
      compare: (a, b) => {
        const numA = parseFloat(a.marketCap.replace(/\$|,/g, ''));
        const numB = parseFloat(b.marketCap.replace(/\$|,/g, ''));
        return numA - numB;
      },
      multiple: 2,
    },
    render: (text: string) => (
        <Text style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
          {text}
        </Text>
    ),
  },
  {
    title: "Объем (24ч)",
    dataIndex: "volume",
    key: "volume",
    width: 150,
    sorter: {
      compare: (a, b) => {
        const numA = parseFloat(a.volume.replace(/\$|,/g, ''));
        const numB = parseFloat(b.volume.replace(/\$|,/g, ''));
        return numA - numB;
      },
      multiple: 1,
    },
    render: (text: string) => (
        <Text style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
          {text}
        </Text>
    ),
  },
  {
    title: "График (7д)",
    key: "chart",
    width: 180,
    render: (_, record) => (
        <SparklineChart
            data={record.sparkline || []}
            priceChange={record.priceChange7d}
            width={180}
            height={60}
        />
    ),
  },
];

export default function CurrencyTable() {
  const [page, setPage] = useState(1);
  const [sort] = useState("market_cap_desc");
  const [chatVisible, setChatVisible] = useState(false);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["currencies", page, sort],
    queryFn: () => fetchData(page, sort),
  });

  if (isError) {
    return (
        <div style={{
          fontFamily: '"Press Start 2P", cursive',
          color: '#ff2d75',
          padding: '20px',
          textAlign: 'center'
        }}>
          ERROR: {error.toString()}
        </div>
    );
  }

  return (
      <div className={styles.container}>
        {isLoading ? (
            <Spin
                className={styles.loading}
                indicator={<LoadingOutlined style={{ fontSize: 56, color: '#ff2d75' }} spin />}
            />
        ) : (
            <>
              <Table<CryptoDataType>
                  className={styles.table}
                  columns={columns}
                  dataSource={transformData(data)}
                  pagination={false}
                  size="middle"
                  scroll={{ x: true }}
                  rowKey="key"
              />

              <div className={styles.pagination}>
                <Button
                    onClick={() => page > 1 && setPage(page - 1)}
                    disabled={page === 1}
                    className={styles.paginationButton}
                >
                  ← BACK
                </Button>
                <Typography.Text className={styles.pageNumber}>
                  PAGE {page}
                </Typography.Text>
                <Button
                    onClick={() => setPage(page + 1)}
                    disabled={data && data.length < 10}
                    className={styles.paginationButton}
                >
                  NEXT →
                </Button>
              </div>

              <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  className={styles.chatButton}
                  onClick={() => setChatVisible(true)}
              >
                💬
              </Button>

              <Drawer
                  title={
                    <span style={{ fontFamily: '"Press Start 2P", cursive' }}>
                CRYPTO CHAT
              </span>
                  }
                  placement="right"
                  onClose={() => setChatVisible(false)}
                  open={chatVisible}
                  width={400}
                  headerStyle={{
                    background: '#0d0221',
                    borderBottom: '2px solid #ff2d75',
                    fontFamily: '"Press Start 2P", cursive'
                  }}
                  bodyStyle={{ padding: 0 }}
              >
                <Chat />
              </Drawer>
            </>
        )}
      </div>
  );
}