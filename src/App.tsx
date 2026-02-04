import { lazy } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout/MainLayout";
import { useMarketPrices } from "./hooks/useMarketPrices";

const Market = lazy(() => import("./pages/Market/Market"));
const Statistics = lazy(() => import("./pages/Statistics/Statistics"));
const Portfolio = lazy(() => import("./pages/Portfolio/Portfolio"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

export default function App() {
  useMarketPrices();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Market />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="portfolio" element={<Portfolio />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
