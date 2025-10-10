import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Market from "./pages/Market/Market";
import Statistics from "./pages/Statistics/Statistics";
import Portfolio from "./pages/Portfolio/Portfolio";
import MainLayout from "./layout/MainLayout/MainLayout";
import NotFound from "./pages/NotFound/NotFound";
import { useMarketPrices } from "./hooks/useMarketPrices";

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
