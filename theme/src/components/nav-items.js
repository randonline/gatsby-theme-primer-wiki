import {
  StyledOcticon,
  Link,
  themeGet,
  Box,
  Heading,
} from "@primer/components";
import {
  LinkExternalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@primer/octicons-react";
import { Link as GatsbyLink } from "gatsby";
import { encodeSlug } from "../utils/encode";
import React from "react";
import styled from "styled-components";
import useThemeConfig from "../use-theme-config";

const NavLink = styled(Link)`
  &.active {
    font-weight: ${themeGet("fontWeights.bold")};
    color: ${themeGet("colors.auto.gray.8")};
  }
`;

const NavBox = styled(Box)`
  &.active {
    font-weight: ${themeGet("fontWeights.bold")};
    color: ${themeGet("colors.auto.gray.8")};
  }
`;
function getGroupIsActive(location, url, items) {
  return (
    (url &&
      (location.pathname.startsWith(url) ||
        location.pathname.startsWith(encodeSlug(url)))) ||
    (Array.isArray(items) &&
      items.find((item) => getGroupIsActive(location, item.url, item.items)))
  );
}
function getIsActive(location, url) {
  return (
    url && (location.pathname === url || location.pathname === encodeSlug(url))
  );
}
function SidebarItem({
  location,
  title,
  isLast,
  url,
  external,
  items,
  depth = 0,
  sidebarDepth = 1,
  type = "normal",
}) {
  items = items || [];
  const defaultShowItems = depth < sidebarDepth;
  const isGroupActive = getGroupIsActive(location, url, items);
  const isActive = getIsActive(location, url);

  const [isShowItems, setIsShowItems] = React.useState(
    isGroupActive || defaultShowItems
  );
  const isHasItems = items.length > 0;

  const handleToggleCollapse = () => {
    setIsShowItems(!isShowItems);
  };
  let isShowBorderBottom = true;
  if (depth === 0 && items.length === 0) {
    isShowBorderBottom = false;
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      ml={depth > sidebarDepth ? 3 : 0}
      borderStyle="solid"
      borderColor="border.primary"
      borderWidth={0}
      borderRadius={0}
      borderBottomWidth={
        depth === 0 && !isLast && sidebarDepth > 0 && isShowBorderBottom ? 1 : 0
      }
      py={sidebarDepth === 0 && depth === 0 ? 1 : depth === 0 ? 2 : 0}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        mb={depth > 0 ? 0 : "1"}
        mt={depth > 0 ? 2 : 1}
        fontSize={depth === 0 && sidebarDepth > 0 ? 2 : 1}
      >
        {external ? (
          <Link
            color={depth > 0 ? undefined : "text.primary"}
            display="block"
            href={url}
          >
            <Box display="flex" alignItems="center" position="relative">
              {title}
              <StyledOcticon
                ml={2}
                sx={{
                  top: "2px",
                  position: "relative",
                }}
                size={14}
                icon={LinkExternalIcon}
                color="text.primary"
              />
            </Box>
          </Link>
        ) : url ? (
          <NavLink
            color={depth > 0 ? undefined : "text.primary"}
            key={title}
            as={GatsbyLink}
            to={url}
            className={isActive ? "active" : undefined}
            display="block"
            sx={
              type === "tag"
                ? {
                    ":before": {
                      content: "'# '",
                      color: "text.disabled",
                      opacity: "0.8",
                    },
                  }
                : {}
            }
          >
            {title}
          </NavLink>
        ) : (
          <NavBox
            key={title}
            color="text.secondary"
            fontWeight={isActive ? "600" : "400"}
            className={isActive ? "active" : undefined}
            display="block"
          >
            {title}
          </NavBox>
        )}
        {depth > sidebarDepth - 1 && (
          <Box
            flex="1"
            pl="2"
            onClick={handleToggleCollapse}
            display="flex"
            justifyContent="flex-end"
          >
            {isHasItems && isShowItems && <ChevronUpIcon size={16} />}
            {isHasItems && !isShowItems && <ChevronDownIcon size={16} />}
          </Box>
        )}
      </Box>

      {isShowItems && Array.isArray(items)
        ? items.map((subItem, index) => (
            <SidebarItem
              sidebarDepth={sidebarDepth}
              location={location}
              isLast={items.length - 1 === index}
              key={subItem.title}
              depth={depth + 1}
              {...subItem}
            />
          ))
        : null}
    </Box>
  );
}

function NavItems({ items, location }) {
  const primerWikiThemeConfig = useThemeConfig();
  return (
    <>
      {items.map((item) => (
        <Box
          key={item.title}
          borderStyle="solid"
          borderColor="border.primary"
          borderWidth={0}
          borderRadius={0}
          borderTopWidth={1}
          p={4}
        >
          <Box display="flex" flexDirection="column">
            {item.title && (
              <Heading
                color="text.disabled"
                fontSize="12px"
                sx={{
                  textTransform: "uppercase",
                  fontFamily: "Content-font, Roboto, sans-serif;",
                }}
                mb={1}
                fontWeight="500"
              >
                {item.title}
              </Heading>
            )}
            {Array.isArray(item.items)
              ? item.items.map((child, index) => (
                  <SidebarItem
                    sidebarDepth={primerWikiThemeConfig.sidebarDepth}
                    location={location}
                    isLast={item.items.length - 1 === index}
                    key={child.title}
                    {...child}
                  ></SidebarItem>
                ))
              : null}
          </Box>
        </Box>
      ))}
    </>
  );
}

export default NavItems;
