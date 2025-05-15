import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Configure global AG Grid options
export const defaultGridOptions = {
  suppressPropertyNamesCheck: true,
  suppressBrowserResizeObserver: true,
  suppressColumnVirtualisation: true,
  suppressRowVirtualisation: true,
};
