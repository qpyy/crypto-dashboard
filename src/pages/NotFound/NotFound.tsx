import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.text}>Упс! Похоже, этой страницы не существует...</p>
        <p className={styles.subtext}>Может быть, вы заблудились в финансовых графиках?</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Вернуться домой
        </Button>
      </div>

      <div className={styles.graph}>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </div>
    </div>
  );
}
