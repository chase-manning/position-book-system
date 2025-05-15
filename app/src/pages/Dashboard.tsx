import type { FC } from "react";
import { useState } from "react";
import {
  BorderLayout,
  BorderItem,
  Card,
  FlowLayout,
  StackLayout,
  Text,
  Panel,
  Spinner,
  StatusIndicator,
  Button,
  SplitLayout,
} from "@salt-ds/core";
import { usePositions } from "../app/use-positions";
import { AgGridReact } from "ag-grid-react";
import "@salt-ds/ag-grid-theme/salt-ag-theme.css";
import type { ColDef } from "ag-grid-community";
import { defaultGridOptions } from "../app/ag-grid-config";
import { useNavigate } from "react-router-dom";

const Dashboard: FC = () => {
  const { data: positions, isLoading, error, refetch } = usePositions();
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  // Calculate key metrics
  const totalPositions = positions?.length || 0;
  const totalQuantity =
    positions?.reduce((sum, pos) => sum + pos.Quantity, 0) || 0;
  const uniqueSecurities = new Set(positions?.map((pos) => pos.Security)).size;
  const uniqueAccounts = new Set(positions?.map((pos) => pos.Account)).size;

  // Prepare position summary data
  const positionSummaryData =
    positions?.map((pos) => ({
      Account: pos.Account,
      Security: pos.Security,
      Quantity: pos.Quantity,
      Events: pos.Events.length,
    })) || [];

  const positionSummaryColumns: ColDef[] = [
    { field: "Account", headerName: "Account", sortable: true, filter: true },
    { field: "Security", headerName: "Security", sortable: true, filter: true },
    {
      field: "Quantity",
      headerName: "Quantity",
      sortable: true,
      filter: true,
      cellClass: ["numeric-cell"],
    },
    {
      field: "Events",
      headerName: "Events",
      sortable: true,
      filter: true,
      cellClass: ["numeric-cell"],
    },
  ];

  if (isLoading) {
    return (
      <StackLayout
        align="center"
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "var(--salt-container-primary-background)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size="large" aria-label="Loading dashboard" role="status" />
      </StackLayout>
    );
  }

  if (error) {
    return (
      <StackLayout
        align="center"
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "var(--salt-container-primary-background)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StackLayout gap={2} align="center">
          <StatusIndicator
            status="error"
            size={5}
            style={{ marginBottom: 8 }}
          />
          <Text styleAs="h2">Failed to load dashboard</Text>
          <Text>We couldn't load your dashboard data. Please try again.</Text>
          <Button onClick={() => refetch()}>Retry</Button>
        </StackLayout>
      </StackLayout>
    );
  }

  return (
    <BorderLayout
      style={{
        minHeight: "100%",
        width: "100%",
        background: "var(--salt-container-primary-background)",
      }}
    >
      <BorderItem position="north">
        <StackLayout
          gap={3}
          style={{
            padding: "var(--salt-spacing-300)",
            background: "var(--salt-container-secondary-background)",
          }}
        >
          <Text styleAs="h1">Dashboard</Text>
          <FlowLayout gap={3}>
            <Card>
              <StackLayout gap={1}>
                <Text styleAs="h4">Total Positions</Text>
                <Text styleAs="h2">{totalPositions}</Text>
              </StackLayout>
            </Card>
            <Card>
              <StackLayout gap={1}>
                <Text styleAs="h4">Total Quantity</Text>
                <Text styleAs="h2">{totalQuantity}</Text>
              </StackLayout>
            </Card>
            <Card>
              <StackLayout gap={1}>
                <Text styleAs="h4">Unique Securities</Text>
                <Text styleAs="h2">{uniqueSecurities}</Text>
              </StackLayout>
            </Card>
            <Card>
              <StackLayout gap={1}>
                <Text styleAs="h4">Unique Accounts</Text>
                <Text styleAs="h2">{uniqueAccounts}</Text>
              </StackLayout>
            </Card>
          </FlowLayout>
        </StackLayout>
      </BorderItem>

      <BorderItem position="center">
        <StackLayout
          gap={3}
          style={{
            padding: "var(--salt-spacing-300)",
          }}
        >
          <SplitLayout
            style={{
              borderBottom:
                "1px solid var(--salt-separable-primary-borderColor)",
            }}
          >
            <Button
              variant={activeTab === 0 ? "primary" : "secondary"}
              onClick={() => setActiveTab(0)}
            >
              Position Summary
            </Button>
            <Button
              variant={activeTab === 1 ? "primary" : "secondary"}
              onClick={() => setActiveTab(1)}
            >
              Trade Activity
            </Button>
          </SplitLayout>

          {activeTab === 0 && (
            <Panel
              variant="primary"
              style={{
                width: "100%",
                padding: "var(--salt-spacing-300)",
                boxSizing: "border-box",
                boxShadow: "var(--salt-overlayable-shadow-scroll)",
              }}
            >
              <div
                className="ag-theme-salt-light"
                style={{ height: 400, width: "100%" }}
              >
                <AgGridReact
                  {...defaultGridOptions}
                  rowData={positionSummaryData}
                  columnDefs={positionSummaryColumns}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                  }}
                  animateRows={true}
                  enableCellTextSelection={true}
                  pagination={true}
                  paginationPageSize={10}
                />
              </div>
            </Panel>
          )}

          {activeTab === 1 && (
            <StackLayout gap={3}>
              <Card>
                <StackLayout gap={2}>
                  <Text styleAs="h3">Recent Trade Activity</Text>
                  <Text>
                    View and manage your trade events in the Events page.
                  </Text>
                  <Button onClick={() => navigate("/")} variant="primary">
                    View Events
                  </Button>
                </StackLayout>
              </Card>
            </StackLayout>
          )}
        </StackLayout>
      </BorderItem>
    </BorderLayout>
  );
};

export default Dashboard;
