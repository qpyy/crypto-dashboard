import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import Sidebar from "../../components/UI/Sidebar/Sidebar";
import { Toggle } from "../../components/UI/Toggle/Toggle";
import { useTheme } from "../../store/theme/useTheme";
import styles from "./MainLayout.module.css";
import SnackbarContainer from "../../components/UI/Snackbar/SnackbarContainer";
import { useSnackbar } from "../../store/snackbar/snackbar";
import ParallaxScene from "../../components/UI/ParallaxScene/ParallaxScene";
import Footer from "../../components/UI/Footer/Footer";

export default function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const isVisited = localStorage.getItem("visited");
    if (!isVisited) {
      showSnackbar("Добро пожаловать!", "success");
      localStorage.setItem("visited", "true");
    }
  }, [showSnackbar]);

  return (
    <div className={styles.layout}>
      <ParallaxScene />
      <Sidebar />
      <div className={styles.topbar}>
        <Toggle
          checked={theme === "dark"}
          onChange={toggleTheme}
          onIcon={<IoMoonOutline size={12} />}
          offIcon={<IoSunnyOutline size={12} />}
          ariaLabel="Переключить тему"
        />
      </div>
      <div className={styles.contentWrapper}>
        <main className={styles.content}>
          <Suspense
            fallback={
              <div className={styles.pageFallback} role="status" aria-live="polite">
                <div className={styles.pageSkeleton} />
                <div className={styles.pageSkeleton} />
                <div className={`${styles.pageSkeleton} ${styles.pageSkeletonTall}`} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <SnackbarContainer />
    </div>
  );
}
