'use client';

import { Modal, Descriptions, Button, message, Spin } from 'antd';
import { Document } from '@/types/document';
import { documentService } from '@/services/documentService';
import { useState } from 'react';
import styles from './DocumentDetailModal.module.css';

interface DocumentDetailModalProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
}

export function DocumentDetailModal({ document, open, onClose }: DocumentDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    if (!document) return;

    setLoading(true);
    try {
      const response = await documentService.analyzeDocument(document.id);
      setAnalyzed(true);
      message.success(response.message);
    } catch (error) {
      message.error('Ошибка при анализе документа');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnalyzed(false);
    onClose();
  };

  if (!document) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Modal
      title="Подробнее о документе"
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="analyze" type="primary" onClick={handleAnalyze} loading={loading} disabled={analyzed}>
          {analyzed ? 'Анализ выполнен' : 'Проанализировать'}
        </Button>,
        <Button key="close" onClick={handleClose}>
          Закрыть
        </Button>,
      ]}
      width={600}
    >
      <Spin spinning={loading}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ID">{document.id}</Descriptions.Item>
          <Descriptions.Item label="Название файла">{document.file_name}</Descriptions.Item>
          <Descriptions.Item label="Версия">{document.version}</Descriptions.Item>
          <Descriptions.Item label="Размер">{formatFileSize(document.size)}</Descriptions.Item>
          <Descriptions.Item label="Дата загрузки">{document.upload_date}</Descriptions.Item>
          {document.userId && (
            <Descriptions.Item label="ID пользователя">{document.userId}</Descriptions.Item>
          )}
          {document.body && (
            <Descriptions.Item label="Содержимое">
              <div className={styles.bodyContent}>{document.body}</div>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Spin>
    </Modal>
  );
}



