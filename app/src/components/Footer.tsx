import { FlexItem, FlexLayout, StackLayout } from "@salt-ds/core";
import { GithubIcon } from "@salt-ds/icons";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <FlexLayout
      style={{
        padding: "var(--salt-spacing-200)",
      }}
      justify="space-between"
      align="center"
      gap={3}
    >
      <FlexItem align="center">
        <Link to="/">
          <img
            alt="logo"
            src={logo}
            style={{
              display: "block",
              height: "calc(var(--salt-size-base) - var(--salt-spacing-50))",
            }}
          />
        </Link>
      </FlexItem>
      <FlexItem align="center">
        <StackLayout direction="row" gap={1}>
          <Link
            to="https://github.com/chase-manning/position-book-system"
            target="_blank"
          >
            <GithubIcon />
          </Link>
        </StackLayout>
      </FlexItem>
    </FlexLayout>
  );
};

export default Footer;
