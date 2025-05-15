import {
  BorderItem,
  Button,
  Drawer,
  FlexItem,
  FlexLayout,
  NavigationItem,
  StackLayout,
  useResponsiveProp,
} from "@salt-ds/core";
import { CloseIcon, GithubIcon, MenuIcon } from "@salt-ds/icons";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

interface NavigationItemType {
  label: string;
  route: string;
}

const NAVIGATION_ITEMS: NavigationItemType[] = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "About",
    route: "/about",
  },
];

interface UtilityItemType {
  icon: ReactNode;
  key: string;
  route: string;
}

const UTILITIES: UtilityItemType[] = [
  {
    icon: <GithubIcon />,
    key: "GitHub",
    route: "https://github.com/chase-manning/position-book-system",
  },
];

const Header = () => {
  const [offset, setOffset] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = useResponsiveProp(
    {
      xs: true,
      sm: false,
    },
    false
  );

  const setScroll = () => {
    setOffset(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", setScroll);
    return () => {
      window.removeEventListener("scroll", setScroll);
    };
  }, []);

  const DesktopAppHeader: FC<{
    items: NavigationItemType[];
    utilities: UtilityItemType[];
  }> = ({ items, utilities }) => {
    return (
      <header>
        <FlexLayout
          style={{
            paddingLeft: "var(--salt-spacing-300)",
            paddingRight: "var(--salt-spacing-300)",
            backgroundColor: "var(--salt-container-primary-background)",
            position: "fixed",
            width: "100%",
            boxShadow:
              offset > 0 ? "var(--salt-overlayable-shadow-scroll)" : "none",
            borderBottom:
              "var(--salt-size-border) var(--salt-container-borderStyle) var(--salt-separable-primary-borderColor)",
          }}
          justify="space-between"
          gap={3}
        >
          <FlexItem align="center">
            <Link to="/">
              <img
                alt="logo"
                src={logo}
                style={{
                  display: "block",
                  height:
                    "calc(var(--salt-size-base) - var(--salt-spacing-50))",
                }}
              />
            </Link>
          </FlexItem>
          <nav>
            <ul
              style={{
                display: "flex",
                listStyle: "none",
                padding: "0",
                margin: "0",
              }}
            >
              {items.map((item) => (
                <li key={item.label}>
                  <NavigationItem
                    active={location.pathname == item.route}
                    onClick={() => navigate(item.route)}
                  >
                    {item.label}
                  </NavigationItem>
                </li>
              ))}
            </ul>
          </nav>
          <FlexItem align="center">
            <StackLayout direction="row" gap={1}>
              {utilities.map((utility) => (
                <Link key={utility.key} to={utility.route} target="_blank">
                  {utility.icon}
                </Link>
              ))}
            </StackLayout>
          </FlexItem>
        </FlexLayout>
      </header>
    );
  };

  const MobileAppHeader: FC<{
    items: NavigationItemType[];
    utilities: UtilityItemType[];
  }> = ({ items, utilities }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleClick = () => {
      setDrawerOpen(false);
    };

    return (
      <header>
        <StackLayout
          direction="row"
          gap={3}
          style={{
            width: "100%",
            height: "calc(var(--salt-size-base) + var(--salt-spacing-200))",
            backgroundColor: "var(--salt-container-primary-background)",
            zIndex: "calc(var(--salt-zIndex-drawer) + 1)",
            position: "fixed",
            borderBottom:
              "var(--salt-size-border) var(--salt-separable-borderStyle) var(--salt-separable-primary-borderColor)",
            boxShadow: offset > 0 ? "var(--salt-shadow-1)" : "none",
          }}
        >
          <FlexItem
            style={{
              justifyContent: "center",
              display: "flex",
              paddingLeft: "var(--salt-spacing-100)",
            }}
          >
            {!drawerOpen && (
              <Button
                onClick={() => setDrawerOpen(true)}
                style={{
                  alignSelf: "center",
                }}
                appearance="transparent"
              >
                <MenuIcon />
              </Button>
            )}
            {drawerOpen && (
              <Button
                onClick={() => setDrawerOpen(false)}
                style={{
                  alignSelf: "center",
                }}
                appearance="transparent"
              >
                <CloseIcon />
              </Button>
            )}
          </FlexItem>
          <FlexItem align="center">
            <Link to="/">
              <img
                alt="logo"
                src={logo}
                style={{
                  display: "block",
                  height:
                    "calc(var(--salt-size-base) - var(--salt-spacing-50))",
                }}
              />
            </Link>
          </FlexItem>
        </StackLayout>
        <Drawer
          style={{
            paddingTop: "calc(var(--salt-size-base) + var(--salt-spacing-200))",
            paddingLeft: "0",
          }}
          open={drawerOpen}
          onOpenChange={() => {
            if (drawerOpen) {
              setDrawerOpen(false);
            }
          }}
        >
          <nav>
            <ul
              style={{
                listStyle: "none",
                padding: "0",
              }}
            >
              {items.map((item) => (
                <li key={item.label}>
                  <NavigationItem
                    active={location.pathname === item.route}
                    orientation="vertical"
                    onClick={() => {
                      handleClick();
                      navigate(item.route);
                    }}
                  >
                    {item.label}
                  </NavigationItem>
                </li>
              ))}
              {utilities.map((utility) => (
                <li key={utility.key}>
                  <Link
                    to={utility.route}
                    target="_blank"
                    onClick={handleClick}
                  >
                    {utility.icon}
                    {utility.key}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Drawer>
      </header>
    );
  };

  return (
    <BorderItem position="north">
      {isMobile ? (
        <MobileAppHeader items={NAVIGATION_ITEMS} utilities={UTILITIES} />
      ) : (
        <DesktopAppHeader items={NAVIGATION_ITEMS} utilities={UTILITIES} />
      )}
    </BorderItem>
  );
};

export default Header;
