import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import SchoolList from "./pages/SchoolList";
import SchoolDetailPage from "./pages/SchoolDetailPage";
import Recommend from "./pages/Recommend";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";
import Timeline from "./pages/Timeline";
import CostCalculator from "./pages/CostCalculator";
import NotFound from "./pages/NotFound";

// eslint-disable-next-line react-refresh/only-export-components
const Map = lazy(() => import("./pages/Map"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="schools" element={<SchoolList />} />
            <Route path="schools/:id" element={<SchoolDetailPage />} />
            <Route path="recommend" element={<Recommend />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="compare" element={<Compare />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="cost" element={<CostCalculator />} />
            <Route
              path="map"
              element={
                <Suspense fallback={<div className="flex items-center justify-center h-96"><div className="text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" /><p className="text-gray-500">地图加载中...</p></div></div>}>
                  <Map />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
