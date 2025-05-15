import type { FC } from "react";
import { usePositions } from "../app/use-positions";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "@salt-ds/ag-grid-theme/salt-ag-theme.css";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import type { TradeEvent } from "../app/use-positions";
import { defaultGridOptions } from "../app/ag-grid-config";
import { Text } from "@salt-ds/core";

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
    return <div>Loading positions...</div>;
  }

  if (error) {
    return <div>Error loading positions: {error.message}</div>;
  }

  return (
    <div>
      <Text styleAs="h1">Position Book System</Text>
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
    </div>
  );
};

export default Home;
