import { Layout } from "antd";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Logo from "./components/Logo/Logo";
import MenuList from "./components/MenuList/MenuList";
import Home from "./pages/Home";
import CountyMapVisualization from "./pages/CountyMapVisualization";
import AboutUs from "./pages/AboutUs";
import "./index.css";
import "./App.css";


const { Header, Content, Footer} = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const renderHeaderContent = () => {
    console.log("Current Route:", location.pathname);
    if (location.pathname === "/") {
      return <h1>RADI: Rural Access Determinant Index</h1>;
    }
    if (location.pathname.includes("/county-map-visualization")) {
      return <h1>County Map Visualization</h1>;
    }
    if (location.pathname.includes("/about-us")) {
      return <h1>About Us</h1>;
    }
    return <h1>My Application</h1>;
  };

  return (
    <Layout>
      <Layout>
        <Header className="header">
          <div className="header-content">
            {renderHeaderContent()} {/* Dynamically render content based on the route */}
          </div>
        </Header>
        <Content className={`content ${collapsed ? "expanded" : ""}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/county-map-visualization" element={<CountyMapVisualization />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
          <div className="footer">
          </div>
        </Content>
        
      </Layout>
    </Layout>
  );
};

export default App;