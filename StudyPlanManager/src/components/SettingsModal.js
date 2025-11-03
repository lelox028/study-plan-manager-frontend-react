import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "../dist/profileModals.module.scss";

function SettingsModal({ isOpen, onClose, onSave }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    language: "en",
    timezone: "UTC",
  });

  if (!isOpen) return null;

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual settings save functionality
    console.log("Saving settings:", settings);
    if (onSave) {
      onSave(settings);
    }
    onClose();
  };

  return (
    <div className={styles.ModalOverlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.ModalHeader}>
          <h2>Settings</h2>
          <button className={styles.CloseButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.ModalBody}>
            <div className={styles.SettingsSection}>
              <h3>Notifications</h3>

              <div className={styles.SettingItem}>
                <div className={styles.SettingInfo}>
                  <label>Email Notifications</label>
                  <small>Receive email updates about your study plan</small>
                </div>
                <label className={styles.Switch}>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                  />
                  <span className={styles.Slider}></span>
                </label>
              </div>

              <div className={styles.SettingItem}>
                <div className={styles.SettingInfo}>
                  <label>Push Notifications</label>
                  <small>Receive push notifications in browser</small>
                </div>
                <label className={styles.Switch}>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle("pushNotifications")}
                  />
                  <span className={styles.Slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.SettingsDivider}></div>

            <div className={styles.SettingsSection}>
              <h3>Appearance</h3>

              <div className={styles.SettingItem}>
                <div className={styles.SettingInfo}>
                  <label>Dark Mode</label>
                  <small>Use dark theme throughout the app</small>
                </div>
                <label className={styles.Switch}>
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => handleToggle("darkMode")}
                  />
                  <span className={styles.Slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.SettingsDivider}></div>

            <div className={styles.SettingsSection}>
              <h3>Preferences</h3>

              <div className={styles.FormGroup}>
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className={styles.FormGroup}>
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
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
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsModal;
