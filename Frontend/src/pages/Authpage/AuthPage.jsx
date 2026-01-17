import { Outlet } from "react-router-dom";
import About from "../Authpage/About";
import styles from "./AuthPage.module.css";

const AuthPage = () => {
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Outlet />
        </div>
        <div className={styles.right}>
          <About />
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
