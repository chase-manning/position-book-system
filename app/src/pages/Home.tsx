import type { FC } from "react";
import { usePositions } from "../app/use-positions";
import { AgGridReact } from "ag-grid-react";
import "@salt-ds/ag-grid-theme/salt-ag-theme.css";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { defaultGridOptions } from "../app/ag-grid-config";
import {
  Text,
  StackLayout,
  Panel,
  FlexLayout,
  Spinner,
  StatusIndicator,
  Button,
} from "@salt-ds/core";
import { useState } from "react";

const Home: FC = () => {
  const { data: positions, isLoading, error, refetch } = usePositions();
  const [deletingRow, setDeletingRow] = useState<string | null>(null);

  const handleDelete = async (account: string, security: string) => {
    setDeletingRow(account + security);
    try {
      // Assuming backend expects a CANCEL event for deletion
      await fetch("http://localhost:8080/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Events: [
            {
              ID: Date.now().toString(),
              Action: "CANCEL",
              Account: account,
              Security: security,
              Quantity: 0,
            },
          ],
        }),
      });
      await refetch();
    } catch {
      // Optionally show error
    } finally {
      setDeletingRow(null);
    }
  };

  const columnDefs: ColDef[] = [
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
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params: ICellRendererParams) => {
        const { Account, Security } = params.data;
        const isLoading = deletingRow === Account + Security;
        return (
          <Button
            disabled={isLoading}
            onClick={() => handleDelete(Account, Security)}
            style={{ minWidth: 80 }}
            sentiment="neutral"
            aria-label={isLoading ? "Cancelling" : "Cancel"}
          >
            {isLoading ? (
              <Spinner size="small" aria-label="Cancelling" />
            ) : (
              "Cancel"
            )}
          </Button>
        );
      },
      width: 120,
      pinned: "right",
      sortable: false,
      filter: false,
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
        <Spinner size="large" aria-label="Loading positions" role="status" />
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
          <Text styleAs="h2">Failed to load positions</Text>
          <Text>We couldn't load your positions. Please try again.</Text>
          <Button onClick={() => refetch()}>Retry</Button>
        </StackLayout>
      </StackLayout>
    );
  }

  return (
    <StackLayout
      align="center"
      gap={5}
      style={{
        minHeight: "100%",
        width: "100%",
        background: "var(--salt-container-primary-background)",
      }}
    >
      <FlexLayout
        direction="column"
        align="center"
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "var(--salt-spacing-400) 0",
        }}
      >
        <Text styleAs="h1" style={{ marginBottom: "var(--salt-spacing-300)" }}>
          Position Book System
        </Text>
        <Panel
          variant="primary"
          style={{
            width: "100%",
            padding: "var(--salt-spacing-300)",
            boxSizing: "border-box",
            boxShadow: "var(--salt-overlayable-shadow-scroll)",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <div
            className="ag-theme-salt-light"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              {...defaultGridOptions}
              rowData={positions}
              columnDefs={columnDefs}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                resizable: false,
              }}
              animateRows={true}
              enableCellTextSelection={true}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </Panel>
      </FlexLayout>
    </StackLayout>
  );
};

export default Home;
