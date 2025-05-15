import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import type { GridOptions } from "ag-grid-community";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Configure global AG Grid options
export const defaultGridOptions: GridOptions = {
  suppressColumnVirtualisation: true,
  suppressRowVirtualisation: true,
  paginationPageSizeSelector: [10, 20, 50, 100],
  paginationPageSize: 10,
};
