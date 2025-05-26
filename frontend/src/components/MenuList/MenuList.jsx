import React from "react";
import { Menu } from "antd";
import { HomeOutlined, DatabaseOutlined, LineChartOutlined, InfoCircleOutlined, TeamOutlined, DotChartOutlined,
  WarningOutlined, DashboardOutlined, ControlOutlined, CompassOutlined, CloudServerOutlined, QuestionCircleOutlined, 
  BulbOutlined, ArrowDownOutlined
 } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./MenuList.css";

const MenuList = () => {
  return (
    <Menu mode="inline" className="menu-list">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>

      <Menu.SubMenu key="county-map-visualization" icon={<DashboardOutlined />} title="County Map Visualization">
        <Menu.Item key="radi" icon={<CompassOutlined />}>
          <Link to="/county-map-visualization/?view=radi">RADI</Link>
        </Menu.Item>
        <Menu.Item key="rucc" icon={<DatabaseOutlined />}>
          <Link to="/county-map-visualization/?view=rucc">RUCC</Link>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="about-us" icon={<TeamOutlined />}>
        <Link to="/about-us">About Us</Link>
      </Menu.Item>

    </Menu>
  );
};

export default MenuList;
