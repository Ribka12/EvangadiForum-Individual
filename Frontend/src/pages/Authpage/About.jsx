import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.tag}>{t("about.tag")}</p>
          <h1 className={styles.title}>{t("about.networks")}</h1>
          <p className={styles.text}>{t("about.paragraph1")}</p>
          <p className={styles.text}>{t("about.paragraph2")}</p>
          <span>
            <Link to="/Howitworks" className={styles.btn}>
              {t("about.howItWorksButton")}
            </Link>
          </span>
        </div>
        <div className={styles.rightAccent}></div>
      </div>
    </section>
  );
};

export default About;
