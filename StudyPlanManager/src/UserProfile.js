import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiSettings, FiLogOut, FiLock, FiEdit } from "react-icons/fi";
import styles from "./dist/userProfile.module.scss";
import EditProfileModal from "./components/EditProfileModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import SettingsModal from "./components/SettingsModal";

function UserProfile() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock user data - replace with actual user data from your auth system
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null, // URL to user avatar image, or null for initials
    phone: "",
    bio: "",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    setIsEditProfileOpen(true);
  };

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    setIsChangePasswordOpen(true);
  };

  const handleSettings = () => {
    setIsDropdownOpen(false);
    setIsSettingsOpen(true);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality with your auth system
    console.log("Logout clicked");
    setIsDropdownOpen(false);
    // Example: Clear tokens, redirect to login, etc.
    // localStorage.removeItem('authToken');
    // window.location.href = '/login';
  };

  const handleSaveProfile = (updatedData) => {
    // TODO: Implement API call to save profile data
    console.log("Saving profile data:", updatedData);
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const handleSavePassword = (passwordData) => {
    // TODO: Implement API call to change password
    console.log("Changing password");
  };

  const handleSaveSettings = (settingsData) => {
    // TODO: Implement API call to save settings
    console.log("Saving settings:", settingsData);
  };

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div className={styles.UserProfile} ref={dropdownRef}>
        <div className={styles.ProfileButton} onClick={toggleDropdown}>
          <div className={styles.Avatar}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span className={styles.Initials}>{getInitials(user.name)}</span>
            )}
          </div>
        </div>

        {isDropdownOpen && (
          <div className={styles.Dropdown}>
            <div className={styles.DropdownHeader}>
              <div className={styles.DropdownAvatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span className={styles.Initials}>
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
              <div className={styles.DropdownUserInfo}>
                <span className={styles.DropdownUserName}>{user.name}</span>
                <span className={styles.DropdownUserEmail}>{user.email}</span>
              </div>
            </div>

            <div className={styles.DropdownDivider}></div>

            <div className={styles.DropdownMenu}>
              <button
                className={styles.DropdownItem}
                onClick={handleEditProfile}
              >
                <FiEdit className={styles.DropdownIcon} />
                <span>Edit Profile</span>
              </button>

              <button
                className={styles.DropdownItem}
                onClick={handleChangePassword}
              >
                <FiLock className={styles.DropdownIcon} />
                <span>Change Password</span>
              </button>

              <button className={styles.DropdownItem} onClick={handleSettings}>
                <FiSettings className={styles.DropdownIcon} />
                <span>Settings</span>
              </button>

              <div className={styles.DropdownDivider}></div>

              <button
                className={`${styles.DropdownItem} ${styles.LogoutItem}`}
                onClick={handleLogout}
              >
                <FiLogOut className={styles.DropdownIcon} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSave={handleSavePassword}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </>
  );
}

export default UserProfile;
