import { Button, Card, Empty, Pagination, Table } from "antd";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosConfig";
import { ApiResponse } from "../../types/apiResponse";
import { V1 } from "../../types/config";
import { IncidentResponse } from "../../types/incidentResponse";
import { PaginationData } from "../../types/pagination";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { isFunctionDeclaration } from "typescript";

const Home = () => {
  const [incidents, setIncidents] =
    useState<PaginationData<IncidentResponse>>();
  const [incidentsLoading, setIncidentsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIncidentsLoading(true);
    axiosInstance
      .get(`${V1}/incident`)
      .then(
        ({
          data: { data },
        }: AxiosResponse<ApiResponse<PaginationData<IncidentResponse>>>) => {
          console.log(data);
          setIncidents(data);
        }
      )
      .finally(() => {
        setIncidentsLoading(false);
      });
  }, []);
  useEffect(() => {}, [incidents?.pagination]);
  const columns = [
    {
      title: "Created Time",
      dataIndex: "createdAt",
      // sorter: (a: { age: number }, b: { age: number }) => a.age - b.age,
      children: [],
    },
    {
      title: "Type",
      dataIndex: "incidentType",
      // sorter: (a: { age: number }, b: { age: number }) => a.age - b.age,
      children: [],
    },
    {
      title: "Creator",
      dataIndex: "creatorName",
      // sorter: (a: { age: number }, b: { age: number }) => a.age - b.age,
      children: [],
    },
    {
      title: "Assignee",
      dataIndex: "assigneeName",
      // sorter: (a: { age: number }, b: { age: number }) => a.age - b.age,
      children: [],
    },
    {
      title: "Status",
      dataIndex: "incidentStatus",
      // sorter: (a: { age: number }, b: { age: number }) => a.age - b.age,
      children: [],
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      // sorter: (a: { age: number }, b: { age: number }) => a.age - b.age,
      children: [],
      width: "20%",
    },
    {
      title: "",
      dataIndex: "_id",
      // sorter: (a: { age: number }, b: { age: number }) => a.age - b.age,
      children: [],
      render: (val: any) => {
        return (
          <div>
            <Button
              type="primary"
              style={{ borderColor: "black" }}
              shape="circle"
              icon={<EditOutlined />}
              size="middle"
            />
            <Button
              type="primary"
              style={{
                background: "orange",
                borderColor: "black",
                marginLeft: 10,
              }}
              shape="circle"
              icon={<DeleteOutlined />}
              size="middle"
            />
          </div>
        );
      },
    },
  ];

  function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log("params", pagination, filters, sorter, extra);
    if (pagination) {
      const pageObj= {
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortOrder: "",
        sortKey: "",
        searchQueries: [],
      } ;
    //   setIncidents({
    //     ...incidents,
    //     pagination: {
    //     page: pageObj.page,
    //     pageSize: pageObj.pageSize,
    //     searchQueries: pageObj.searchQueries,
    //     sortKey: pageObj.sortKey,
    //     sortOrder: pageObj.sortOrder
    //     }
    //   });
    }
  }
  return (
    <div className="Home">
      <Table
        bordered={true}
        loading={incidentsLoading}
        columns={columns}
        dataSource={incidents?.data ?? []}
        onChange={onChange}
        pagination={{
          defaultPageSize: 5,
          current: incidents?.pagination.page ?? 1,
          defaultCurrent: 1,
          pageSize: incidents?.pagination.pageSize,
          total: incidents?.totalRecords ?? 0,
          pageSizeOptions: ["5", "10", "20", "50"],
          showSizeChanger: true,
        }}
      >
        {!incidents?.data && <Empty description="No Data Found"></Empty>}
      </Table>
    </div>
  );
};
export default Home;
