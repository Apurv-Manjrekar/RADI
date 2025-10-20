import { Layout, Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import USCountyMap from "./pages/USCountyMap";
import DatasetSearch from "./pages/DatasetSearch"; // Add this import
import "./App.css";
import "./index.css";

const { Header, Content, Footer } = Layout;

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "/", label: <Link to="/">Home</Link> },
    { key: "/county-map", label: <Link to="/county-map">County Map</Link> },
    { key: "/dataset-search", label: <Link to="/dataset-search">Dataset Search</Link> }, // Add this
    { key: "/about-us", label: <Link to="/about-us">About Us</Link> },
  ];

  const renderHeaderTitle = () => {
    if (location.pathname === "/") return "RADI: Rural Access Determinant Index";
    if (location.pathname.includes("/county-map")) return "County Map Visualization";
    if (location.pathname.includes("/dataset-search")) return "Dataset Search"; // Add this
    if (location.pathname.includes("/about-us")) return "About Us";
    return "RADI";
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Header className="header">
        <div className="nav-container">
          <div className="logo">
            <h1>{renderHeaderTitle()}</h1>
          </div>

          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              className="nav-menu"
            />
          )}

          {isMobile && (
            <>
              <Button
                type="text"
                icon={<MenuOutlined />}
                className="menu-button"
                onClick={() => setDrawerOpen(true)}
              />
              <Drawer
                title="Navigation"
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
              >
                <Menu
                  mode="vertical"
                  selectedKeys={[location.pathname]}
                  items={menuItems}
                  onClick={() => setDrawerOpen(false)}
                />
              </Drawer>
            </>
          )}
        </div>
      </Header>

      <Content className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/county-map" element={<USCountyMap />} />
          <Route path="/dataset-search" element={<DatasetSearch />} />
          <Route path="/about-us" element={<AboutUs />} />
          {/* Redirect /RADI/ to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>

      <Footer className="footer">
        <p>© {new Date().getFullYear()} RADI — All Rights Reserved</p>
      </Footer>
    </Layout>
  );
};

export default App;