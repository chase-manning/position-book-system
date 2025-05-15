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
import { useNavigate } from "react-router-dom";
import type { TradeEvent } from "../app/use-positions";

const Events: FC = () => {
  const { data: positions, isLoading, error, refetch } = usePositions();
  const [deletingRow, setDeletingRow] = useState<string | null>(null);
  const navigate = useNavigate();

  // Flatten all events from all positions into a single array
  const events = positions
    ? positions.flatMap((pos) =>
        pos.Events.map((event) => ({
          ...event,
        }))
      )
    : [];

  const handleDelete = async (event: TradeEvent) => {
    setDeletingRow(event.ID);
    try {
      await fetch("http://localhost:8080/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Events: [
            {
              ID: event.ID,
              Action: "CANCEL",
              Account: event.Account,
              Security: event.Security,
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
    { field: "ID", headerName: "ID", sortable: true, filter: true },
    { field: "Account", headerName: "Account", sortable: true, filter: true },
    { field: "Security", headerName: "Security", sortable: true, filter: true },
    {
      field: "Quantity",
      headerName: "Quantity",
      sortable: true,
      filter: true,
      cellClass: ["numeric-cell"],
    },
    { field: "Action", headerName: "Action", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params: ICellRendererParams) => {
        const event = params.data;
        const isLoading = deletingRow === event.ID;
        // Only show Cancel for BUY/SELL events
        if (event.Action !== "BUY" && event.Action !== "SELL") return null;
        return (
          <Button
            disabled={isLoading}
            onClick={() => handleDelete(event)}
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

  if (!events || events.length === 0) {
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
          <Text styleAs="h2">No Events Found</Text>
          <Text>Get started by creating your first trade event.</Text>
          <Button
            onClick={() => navigate("/create-event")}
            variant="primary"
            style={{ marginTop: "var(--salt-spacing-200)" }}
          >
            Create Event
          </Button>
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
          Trade Events
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
              rowData={events}
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

export default Events;
