"use client";
// app/components/OrderService.tsx
import styles from "../page.module.css";
import { Order } from "../types";

interface Props {
  orders: Order[];
  formData: Partial<Order>;
  handleCreateOrder: (e: React.FormEvent) => void;
  handleDeleteOrder: (orderId: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Order>>>;
  loading: boolean;
}

export default function OrderService({
  orders,
  formData,
  handleCreateOrder,
  handleDeleteOrder,
  setFormData,
  loading,
}: Props) {
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.sectionHeader}>Create New Order</div>
        <form className={styles.form} onSubmit={handleCreateOrder}>
          <input
            type="text"
            value={formData.item || ""}
            onChange={(e) =>
              setFormData((prev: Partial<Order>) => ({ ...prev, item: e.target.value }))
            }
            placeholder="Enter order item"
            required
          />
          <input
            type="text"
            value={formData.userId || ""}
            onChange={(e) =>
              setFormData((prev: Partial<Order>) => ({ ...prev, userId: e.target.value }))
            }
            placeholder="Enter user ID"
            required
          />
          <button type="submit" disabled={loading}>
            Create Order
          </button>
        </form>
      </div>
      <div className={styles.card}>
        <div className={styles.sectionHeader}>Order List</div>
        <div className={styles.list}>
          {orders.length === 0 && (
            <div className={styles.textMuted}>No orders found.</div>
          )}
          {orders.map((order) => (
            <div key={order.id} className={styles.listItem}>
              <div>
                <strong>{order.item}</strong>{" "}
                <span style={{ color: styles.textMuted }}>
                  for User: {order.userId}
                </span>
              </div>
              <div>
                <button
                  className={styles.actionBtn}
                  title="Delete Order"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
