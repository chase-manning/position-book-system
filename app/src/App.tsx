import { BorderItem, BorderLayout, SaltProvider } from "@salt-ds/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@salt-ds/theme/index.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";

const App = () => {
  return (
    <SaltProvider>
      <Router>
        <Header />
        <BorderLayout>
          <BorderItem
            style={{
              marginTop:
                "calc(var(--salt-size-base) + var(--salt-spacing-200))",
            }}
            position="center"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </BorderItem>
          <BorderItem position="south">
            <div
              style={{
                padding: "var(--salt-spacing-200)",
                margin: "var(--salt-spacing-200)",
                backgroundColor: "var(--salt-color-gray-10)",
              }}
            >
              <span>Footer</span>
            </div>
          </BorderItem>
        </BorderLayout>
      </Router>
    </SaltProvider>
  );
};

export default App;
