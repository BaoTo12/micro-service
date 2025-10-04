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
  const [userFormData, setUserFormData] = useState<Partial<User>>({});
  const [orderFormData, setOrderFormData] = useState<Partial<Order>>({});
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
          name: userFormData.name,
          email: userFormData.email,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data: User = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      await fetchUsers(); // Refresh user list
      setUserFormData({}); // Clear form data
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
          item: orderFormData.item,
          userId: orderFormData.userId,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
      const data: Order = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      if (orderFormData.userId === selectedUserId) {
        await fetchOrders(selectedUserId); // Refresh order list
      }
      setOrderFormData({}); // Clear form data
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
      setUserFormData({});
    }
    if (activeTab === "Order Service") {
      setOrderFormData({});
    }
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
              formData={userFormData}
              handleCreateUser={handleCreateUser}
              handleDeleteUser={handleDeleteUser}
              setFormData={setUserFormData}
              setSelectedUserId={setSelectedUserId}
              loading={loading}
            />
          )}
          {activeTab === "Order Service" && (
            <OrderService
              orders={orders}
              formData={orderFormData}
              handleCreateOrder={handleCreateOrder}
              handleDeleteOrder={handleDeleteOrder}
              setFormData={setOrderFormData}
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
        </section>
      </div>
    </main>
  );
}
