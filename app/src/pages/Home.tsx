import type { FC } from "react";
import { usePositions } from "../app/use-positions";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "@salt-ds/ag-grid-theme/salt-ag-theme.css";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import type { TradeEvent } from "../app/use-positions";
import { defaultGridOptions } from "../app/ag-grid-config";
import { Text, StackLayout, Panel, FlexLayout, Spinner } from "@salt-ds/core";

const Home: FC = () => {
  const { data: positions, isLoading, error } = usePositions();

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
      field: "Events",
      headerName: "Events",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return params.value
          .map((event: TradeEvent) => `${event.Action} - ${event.Quantity}`)
          .join(", ");
      },
      cellRenderer: (params: ICellRendererParams<TradeEvent[]>) => {
        return (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {params.value?.map((event: TradeEvent) => (
              <li key={event.ID}>
                {event.Action} - {event.Quantity}
              </li>
            ))}
          </ul>
        );
      },
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
        <Text>Error loading positions: {error.message}</Text>
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
                resizable: true,
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
