"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import UserService from "./components/UserService";
import OrderService from "./components/OrderService";
import { User, Order, ApiError } from "./types";

const TABS = ["User Service", "Order Service"];

export default function Home() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    item: "",
    userId: "",
  });
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:9354/api";

  // Generic error handler
  const handleError = (err: ApiError) => {
    const errorMessage =
      err.response?.data?.message || err.message || "An unknown error occurred";
    setError(errorMessage);
    setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
  };

  // User Service API calls
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/users`);
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      handleError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResponse("");
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data: User = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      await fetchUsers(); // Refresh user list
      setFormData((prev) => ({ ...prev, name: "", email: "" }));
    } catch (err) {
      handleError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      await fetchUsers(); // Refresh list
      setResponse("User deleted successfully");
    } catch (err) {
      handleError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  // Order Service API calls
  const fetchOrders = useCallback(
    async (userId: string) => {
      setLoading(true);
      try {
        const endpoint = `${apiUrl}/orders/user/${userId}`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`API error: ${res.statusText}`);
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err) {
        handleError(err as ApiError);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  );

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResponse("");
    setLoading(true);
    try {
      const endpoint = `${apiUrl}/orders`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: formData.item,
          userId: formData.userId,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data: Order = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      if (formData.userId === selectedUserId) {
        await fetchOrders(selectedUserId); // Refresh order list
      }
      setFormData((prev) => ({ ...prev, item: "", userId: "" }));
    } catch (err) {
      handleError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      await fetchOrders(selectedUserId); // Refresh list
      setResponse("Order deleted successfully");
    } catch (err) {
      handleError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "User Service") {
      fetchUsers();
    }
    // Reset form data when tab changes to avoid stale state
    setFormData({ name: "", email: "", item: "", userId: "" });
  }, [activeTab, fetchUsers]);

  useEffect(() => {
    if (selectedUserId) {
      fetchOrders(selectedUserId);
    }
  }, [selectedUserId, fetchOrders]);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Microservice Dashboard</h1>
        <span style={{ color: "#38bdf8", fontWeight: 600 }}>
          Microservice Demo
        </span>
      </div>
      <div className={styles.dashboard}>
        <nav className={styles.sidebar}>
          <button
            className={activeTab === "User Service" ? styles.active : ""}
            onClick={() => setActiveTab("User Service")}
          >
            Users
          </button>
          <button
            className={activeTab === "Order Service" ? styles.active : ""}
            onClick={() => setActiveTab("Order Service")}
          >
            Orders
          </button>
        </nav>
        <section className={styles.content}>
          {activeTab === "User Service" && (
            <UserService
              users={users}
              formData={formData}
              handleCreateUser={handleCreateUser}
              handleDeleteUser={handleDeleteUser}
              setFormData={setFormData}
              setSelectedUserId={setSelectedUserId}
              loading={loading}
            />
          )}
          {activeTab === "Order Service" && (
            <OrderService
              orders={orders}
              formData={formData}
              handleCreateOrder={handleCreateOrder}
              handleDeleteOrder={handleDeleteOrder}
              setFormData={setFormData}
              loading={loading}
            />
          )}
          {loading && <div className={styles.loading}>Loading...</div>}
          {error && (
            <div className={styles.error}>
              <h2>Error:</h2>
              <p>{error}</p>
            </div>
          )}
          {response && (
            <div className={styles.response}>
              <h2>Response:</h2>
              <pre>{response}</pre>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
