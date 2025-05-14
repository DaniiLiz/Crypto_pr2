import { Spin, Table, Typography, Button } from "antd";
import { useState } from "react";
import type { TableColumnsType } from "antd";
import { useQuery } from "@tanstack/react-query";
import { LoadingOutlined, MessageOutlined, CloseOutlined } from "@ant-design/icons";
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
    render: (_, __, index) => (
        <Text style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
          {index + 1}
        </Text>
    ),
  },
  {
    title: "Лого",
    dataIndex: "logo",
    key: "logo",
    width: 60,
    render: (logo) => (
        <img
            src={logo}
            alt=""
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              imageRendering: 'pixelated'
            }}
        />
    ),
  },
  {
    title: "Монета",
    dataIndex: "name",
    key: "name",
    width: 150,
    render: (name, record) => (
        <div style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
          <Text strong style={{ color: '#ff9e00' }}>{name}</Text>
          <br />
          <Text style={{ color: '#2bff00' }}>{record.symbol}</Text>
        </div>
    ),
  },
  {
    title: "Цена",
    dataIndex: "price",
    key: "price",
    width: 120,
    render: (price) => (
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
    render: (text) => {
      const change = parseFloat(text.replace('%', ''));
      const color = change >= 0 ? '#16c784' : '#ea3943';
      return (
          <Text strong style={{ color, fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
            {change >= 0 ? '+' : ''}{text}
          </Text>
      );
    },
  },
  {
    title: "График 7д",
    key: "chart",
    width: 150,
    render: (_, record) => (
        <SparklineChart
            data={record.sparkline || []}
            width={150}
            height={50}
        />
    ),
  },
];

export default function CurrencyTable() {
  const [page, setPage] = useState(1);
  const [sort] = useState("market_cap_desc");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["crypto", page, sort],
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
          Ошибка: {error.message}
        </div>
    );
  }

  return (
      <div className={styles.container}>
        {isLoading ? (
            <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48, color: '#ff2d75' }} spin />}
                className={styles.loading}
            />
        ) : (
            <>
              <div className={styles.tableWrapper}>
                <Table
                    columns={columns}
                    dataSource={transformData(data)}
                    pagination={false}
                    scroll={{ x: true }}
                    rowKey="key"
                    className={styles.table}
                />
              </div>

              <div className={styles.pagination}>
                <Button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                  ← Назад
                </Button>
                <Text style={{ fontFamily: '"Press Start 2P", cursive' }}>Страница {page}</Text>
                <Button
                    onClick={() => setPage(p => p + 1)}
                    disabled={data?.length < 10}
                >
                  Вперёд →
                </Button>
              </div>

              {/* Кнопка и панель чата */}
              <Button
                  type="primary"
                  className={styles.chatToggle}
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  icon={<MessageOutlined />}
              />

              <div className={`${styles.chatPanel} ${isChatOpen ? styles.open : ''}`}>
                <div className={styles.chatHeader}>
                  <Text strong style={{ fontFamily: '"Press Start 2P", cursive' }}>КРИПТО ЧАТ</Text>
                  <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => setIsChatOpen(false)}
                  />
                </div>
                <Chat />
              </div>
            </>
        )}
      </div>
  );
}