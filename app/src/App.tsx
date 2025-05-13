import { SaltProvider } from "@salt-ds/core";
import { Button } from "@salt-ds/core";
import "@salt-ds/theme/index.css";

const App = () => {
  return (
    <SaltProvider>
      <div>Hello World</div>
      <Button>Click me</Button>
    </SaltProvider>
  );
};

export default App;
