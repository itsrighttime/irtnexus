// TestTable.tsx

import { Table, type TableAction, type TableColumn } from "@/atoms";
import React, { useState } from "react";

// 🔷 Define your data type
type User = {
  id: number;
  name: string;
  age: number;
  status: "Active" | "Inactive";
  email: string;
};

// 🔷 Mock Data
const initialData: User[] = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    status: "Active",
    email: "john@test.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 30,
    status: "Inactive",
    email: "jane@test.com",
  },
  { id: 3, name: "Alice", age: 22, status: "Active", email: "alice@test.com" },
  { id: 4, name: "Bob", age: 28, status: "Inactive", email: "bob@test.com" },
  {
    id: 5,
    name: "Charlie",
    age: 35,
    status: "Active",
    email: "charlie@test.com",
  },
  {
    id: 6,
    name: "David",
    age: 40,
    status: "Inactive",
    email: "david@test.com",
  },
];

// 🔷 Columns Config
const columns: TableColumn<User>[] = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "age",
    title: "Age",
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "status",
    title: "Status",
    render: (row) => (
      <span
        style={{
          color:
            row.status === "Active"
              ? "var(--color-success)"
              : "var(--color-error)",
          fontWeight: 600,
        }}
      >
        {row.status}
      </span>
    ),
  },
];

// 🔷 Row Actions
const actions: TableAction<User>[] = [
  {
    label: "Edit",
    onClick: (row) => {
      console.log("Edit clicked:", row);
      alert(`Edit user: ${row.name}`);
    },
  },
  {
    label: "Delete",
    onClick: (row) => {
      console.log("Delete clicked:", row);
      alert(`Delete user: ${row.name}`);
    },
  },
];

export function TestTable() {
  const [data, setData] = useState<User[]>(initialData);

  // 🔍 Search Handler
  const handleSearch = (query: string) => {
    const filtered = initialData.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase()),
    );
    setData(filtered);
  };

  // 🧠 Cell Click Handler
  const handleCellClick = (row: User, column: TableColumn<User>) => {
    console.log("Cell clicked:", { row, column });
  };

  return (
    <div style={{ padding: "var(--spacing-lg)" }}>
      <h2>Test Table Component</h2>

      <Table<User>
        columns={columns}
        data={data}
        rowActions={actions}
        onCellClick={handleCellClick}
        pageSize={3}
        onSearch={handleSearch}
        controls={{
          search: true,
          pagination: false,
        }}
      />
    </div>
  );
}
