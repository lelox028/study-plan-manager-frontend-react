import React, { useState } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import styles from "../dist/profileModals.module.scss";

function ChangePasswordModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // TODO: Implement actual password change functionality
    console.log("Changing password");
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className={styles.ModalOverlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <h2>Change Password</h2>
          <button className={styles.CloseButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.ModalBody}>
            {error && <div className={styles.ErrorMessage}>{error}</div>}

            <div className={styles.FormGroup}>
              <label htmlFor="currentPassword">Current Password</label>
              <div className={styles.PasswordInputWrapper}>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  className={styles.PasswordToggle}
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="newPassword">New Password</label>
              <div className={styles.PasswordInputWrapper}>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className={styles.PasswordToggle}
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <small className={styles.HelpText}>
                Password must be at least 8 characters long
              </small>
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className={styles.PasswordInputWrapper}>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className={styles.PasswordToggle}
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.ModalFooter}>
            <button
              type="button"
              className={styles.CancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.SaveButton}>
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
