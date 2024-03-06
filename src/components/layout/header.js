import styles from "./layout.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import useAuthStore from "@/store/authStore";

const Header = () => {
  const { user, logout } = useAuthStore();

  const onLogoutClick = () => {
    logout();
  };

  return (
    <div className={styles.header}>
      <label className={styles.searchContainer}>
        <input placeholder="Search here" />
        <span className={styles.searchIcon}>
          <AiOutlineSearch size={25} />
        </span>
      </label>
      <IoMdNotificationsOutline size={25} color="#ffd000" />
      {/* <img src={"./profile.jpg"} /> */}
      <div className={styles.userInfo}>
        <span className={styles["user-name"]}>{user.username}</span>
        <span className={styles["user-role"]}>{user.role?.name}</span>
      </div>
      <button className="btn btn-danger" onClick={onLogoutClick}>
        <RiLogoutBoxRLine /> Logout
      </button>
    </div>
  );
};

export default Header;
