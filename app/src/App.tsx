import { SaltProvider } from "@salt-ds/core";
import { Button, Banner, BannerContent, BannerActions } from "@salt-ds/core";

import "@salt-ds/theme/index.css";

const App = () => {
  return (
    <SaltProvider>
      <div>Hello World</div>
      <Button appearance="solid" sentiment="accented">
        Click me
      </Button>
      <Banner>
        <BannerContent>
          <p>Hello World</p>
        </BannerContent>
        <BannerActions>
          <Button>Click me</Button>
        </BannerActions>
      </Banner>
    </SaltProvider>
  );
};

export default App;
