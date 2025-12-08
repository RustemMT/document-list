'use client';

import { Menu } from 'antd';
import { FileTextOutlined, MessageOutlined } from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Navigation.module.css';

const menuItems = [
  {
    key: '/documents',
    icon: <FileTextOutlined />,
    label: 'Документы',
  },
  {
    key: '/chat',
    icon: <MessageOutlined />,
    label: 'Чат',
  },
];

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>('/documents');

  useEffect(() => {
    if (pathname) {
      setSelectedKey(pathname);
    }
  }, [pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    router.push(key);
  };

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={handleMenuClick}
      className={styles.menu}
    />
  );
}



