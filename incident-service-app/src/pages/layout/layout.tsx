import { Menu, Breadcrumb, Card } from "antd";
import { Header, Content, Footer } from "antd/lib/layout/layout";
import React from "react";
import { ReactNode } from "react";
import "./Layout.scss";

export const Layout = ({ children }: { children: ReactNode })=> {
  return (
      <div className="Wrapper">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["0"]}>
          <Menu.Item key={1}>Incidents</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Incidents</Breadcrumb.Item>
            {/* <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item> */}
          </Breadcrumb>
          <Card className="main-card">{children}</Card>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          SparseCNX Test | Created by Ranga
        </Footer>
      </div>
  );
};
