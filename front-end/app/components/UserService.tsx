"use client";
import { useState } from "react";
import styles from "../page.module.css";
import { User } from "../types";

interface Props {
  users: User[];
  formData: Partial<User>;
  handleCreateUser: (e: React.FormEvent) => void;
  handleDeleteUser: (userId: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setSelectedUserId: (userId: string) => void;
  loading: boolean;
}

const statusOptions = ["ACTIVE", "INACTIVE", "SUSPENDED"];

export default function UserService({
  users,
  formData,
  handleCreateUser,
  handleDeleteUser,
  setFormData,
  setSelectedUserId,
  loading,
}: Props) {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    // ...API call to update user...
    setEditUser(null);
  };

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.sectionHeader}>Create New User</div>
        <form className={styles.form} onSubmit={handleCreateUser}>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={formData.phoneNumber || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, phoneNumber: e.target.value }))
            }
            placeholder="Phone Number"
            maxLength={15}
          />
          <input
            type="text"
            value={formData.address || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Address"
            maxLength={100}
          />
          <input
            type="number"
            value={formData.age || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, age: Number(e.target.value) }))
            }
            placeholder="Age"
            min={0}
            max={150}
          />
          <button type="submit" disabled={loading}>
            Create User
          </button>
        </form>
      </div>
      <div className={styles.card}>
        <div className={styles.sectionHeader}>User List</div>
        <div className={styles.list}>
          {users.length === 0 && (
            <div className={styles.textMuted}>No users found.</div>
          )}
          {users.map((user) => (
            <div key={user.id} className={styles.listItem}>
              <div>
                <strong>{user.name}</strong>{" "}
                <span style={{ color: styles.textMuted }}>({user.email})</span>
                <div
                  style={{
                    fontSize: "0.9em",
                    color: styles.textMuted,
                  }}
                >
                  {user.phoneNumber && <>📞 {user.phoneNumber} </>}
                  {user.address && <>🏠 {user.address} </>}
                  {user.age !== undefined && <>🎂 {user.age} </>}
                </div>
              </div>
              <div>
                <button
                  className={styles.actionBtn}
                  title="View Orders"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  📦
                </button>
                <button
                  className={styles.actionBtn}
                  title="Edit User"
                  onClick={() => {
                    setEditUser(user);
                    setEditForm(user);
                  }}
                >
                  ✏️
                </button>
                <button
                  className={styles.actionBtn}
                  title="Delete User"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => setEditUser(null)}
            >
              ×
            </button>
            <h2>Edit User</h2>
            <form className={styles.form} onSubmit={handleEditUser}>
              <input
                type="text"
                value={editForm.name || ""}
                onChange={(e) =>
                  setEditForm((prev: any) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Name"
                required
              />
              <input
                type="email"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm((prev: any) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Email"
                required
              />
              <input
                type="text"
                value={editForm.phoneNumber || ""}
                onChange={(e) =>
                  setEditForm((prev: any) => ({ ...prev, phoneNumber: e.target.value }))
                }
                placeholder="Phone Number"
                maxLength={15}
              />
              <input
                type="text"
                value={editForm.address || ""}
                onChange={(e) =>
                  setEditForm((prev: any) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Address"
                maxLength={100}
              />
              <input
                type="number"
                value={editForm.age || ""}
                onChange={(e) =>
                  setEditForm((prev: any) => ({ ...prev, age: Number(e.target.value) }))
                }
                placeholder="Age"
                min={0}
                max={150}
              />
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
