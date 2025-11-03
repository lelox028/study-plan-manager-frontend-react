import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "../dist/profileModals.module.scss";

function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual save functionality
    console.log("Saving profile data:", formData);
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className={styles.ModalOverlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <h2>Edit Profile</h2>
          <button className={styles.CloseButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.ModalBody}>
            <div className={styles.FormGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className={styles.FormGroup}>
              <label htmlFor="bio">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows="4"
              />
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
