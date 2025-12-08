"use client";

import { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Document } from "@/types/document";
import { documentService } from "@/services/documentService";
import { DocumentDetailModal } from "@/components/DocumentDetailModal";
import styles from "./page.module.css";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      message.error("Ошибка при загрузке документов");
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (document: Document) => {
    setSelectedDocument(document);
    setModalOpen(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const columns: ColumnsType<Document> = [
    {
      title: "Название файла",
      dataIndex: "file_name",
      key: "file_name",
      ellipsis: true,
    },
    {
      title: "Версия",
      dataIndex: "version",
      key: "version",
      width: 100,
    },
    {
      title: "Размер",
      dataIndex: "size",
      key: "size",
      width: 120,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: "Дата загрузки",
      dataIndex: "upload_date",
      key: "upload_date",
      width: 150,
    },
    {
      title: "Действия",
      key: "actions",
      width: 150,
      render: (_: any, record: Document) => (
        <Button type="link" onClick={() => handleShowDetails(record)}>
          Подробнее
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Документы</h1>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={documents}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>
      <DocumentDetailModal
        document={selectedDocument}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
