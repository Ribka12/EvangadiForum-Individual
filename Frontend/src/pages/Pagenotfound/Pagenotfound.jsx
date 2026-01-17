import { Link } from "react-router-dom";
import styles from "./Pagenotfound.module.css";

function Pagenotfound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.text}>
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link to="/home" className={styles.button}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default Pagenotfound;
