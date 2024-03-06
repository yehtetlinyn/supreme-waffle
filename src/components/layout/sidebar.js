import React, { useCallback, useState } from "react";

import styles from "./layout.module.css";
import Link from "next/link";
import adminRoute from "@/routes/adminRoute";
import Logo from "../../assets/icons/logo";
import ProsegurLogoIcon from "@/assets/icons/prosegurLogoIcon";
import dynamic from "next/dynamic";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import usePageStore from "@/store/pageStore";
import { useRouter } from "next/router";
import { extractPageName } from "@/utils/helpers";
import useSiteSopStore from "@/store/siteSopStore";
import { shallow } from "zustand/shallow";
import useSiteStore from "@/store/siteStore";

const SidebarNav = ({ routes }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const actionMode = extractPageName(pathname, 3);
  const subMenuPath = extractPageName(pathname, 2);
  const mainMenuPath = extractPageName(pathname, 1);

  const siteTabName = searchParams.get("tab");

  const [hoveredRoute, setHoveredRoute] = useState(false);

  const handleMouseOver = useCallback((routeName) => {
    setHoveredRoute(routeName);
  }, []);

  const handleMouseOut = useCallback(() => {
    setHoveredRoute(false);
  }, []);

  const {
    isSubMenuExpand,
    setIsSubMenuExpand,
    handleLeaveOpen,
    setSidebarLinkName,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = usePageStore(
    (state) => ({
      isSubMenuExpand: state.isSubMenuExpand,
      setIsSubMenuExpand: state.setIsSubMenuExpand,
      handleLeaveOpen: state.handleLeaveOpen,
      setSidebarLinkName: state.setSidebarLinkName,
      isSidebarCollapsed: state.isSidebarCollapsed,
      setIsSidebarCollapsed: state.setIsSidebarCollapsed,
    }),
    shallow
  );

  const isFormDirty = usePageStore((state) => state.isFormDirty);

  const setIsCopyMasterSop = useSiteSopStore(
    (state) => state.setIsCopyMasterSop
  );

  return (
    <>
      <Sidebar collapsed={isSidebarCollapsed} className={styles.sidebar}>
        <div
          className={styles.logo}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <ProsegurLogoIcon />
        </div>
        <Menu>
          <div>
            {routes?.map((route, index) => {
              return (
                <React.Fragment key={index}>
                  {route.hasOwnProperty("subMenu") ? (
                    //render submenu
                    <SubMenu
                      onMouseOver={() => handleMouseOver(route.name)}
                      onMouseOut={() => handleMouseOut(route.name)}
                      onClick={() => {
                        setIsSubMenuExpand({
                          ...isSubMenuExpand,
                          [route.mainMenu]: !isSubMenuExpand[route.mainMenu],
                        });
                      }}
                      label={route.name}
                      icon={
                        hoveredRoute === route.name ||
                        pathname?.includes(route?.name)
                          ? route.hoverAndActiveIcon
                          : route.icon
                      }
                      className={
                        pathname?.includes(route.name)
                          ? styles.menuItemActive
                          : isSidebarCollapsed
                          ? styles.menuItemCollapse
                          : styles.menuItem
                      }
                      defaultOpen={
                        mainMenuPath === route.mainMenu &&
                        isSubMenuExpand[mainMenuPath] &&
                        Object.keys(isSubMenuExpand).length
                          ? isSubMenuExpand[mainMenuPath]
                          : false
                      }
                    >
                      {route.subMenu.map((subMenu, index) => (
                        //rendr subMenu items
                        <div
                          key={index}
                          className={`${
                            subMenuPath == subMenu.subMenu &&
                            mainMenuPath == route.mainMenu
                              ? styles.menuItemActive
                              : styles.menuItemWrapper
                          } ${styles.subMenuItem}`}
                          onClick={() => {
                            if (
                              isFormDirty &&
                              (actionMode === "edit" || siteTabName === "sop")
                            ) {
                              handleLeaveOpen(true);
                              setSidebarLinkName(subMenu.path);
                            }
                            setIsCopyMasterSop(false);
                          }}
                        >
                          <MenuItem
                            component={
                              !isFormDirty &&
                              ((siteTabName !== "sop" &&
                                actionMode !== "edit") ||
                                siteTabName === "sop") ? (
                                <Link href={`${subMenu.path}`} />
                              ) : (
                                ""
                              )
                            }
                          >
                            {subMenu.name}
                          </MenuItem>
                        </div>
                      ))}
                    </SubMenu>
                  ) : (
                    //main menu rendering
                    <div
                      className={
                        mainMenuPath == route.mainMenu
                          ? styles.menuItemActive
                          : styles.menuItemWrapper
                      }
                      onMouseOver={() => handleMouseOver(route.name)}
                      onMouseOut={() => handleMouseOut(route.name)}
                      onClick={() => {
                        if (
                          isFormDirty &&
                          (actionMode === "edit" || siteTabName === "sop")
                        ) {
                          handleLeaveOpen(true);
                          setSidebarLinkName(route.path);
                        }
                        setIsCopyMasterSop(false);
                      }}
                    >
                      <MenuItem
                        component={
                          !isFormDirty &&
                          ((siteTabName !== "sop" && actionMode !== "edit") ||
                            siteTabName === "sop") ? (
                            <Link href={`${route.path}`} />
                          ) : (
                            ""
                          )
                        }
                        icon={
                          hoveredRoute === route.name ||
                          pathname.includes(route?.path)
                            ? route.hoverAndActiveIcon
                            : route.icon
                        }
                        className={`${
                          isSidebarCollapsed
                            ? styles.menuItemCollapse
                            : styles.menuItem
                        }`}
                      >
                        {route.name}
                      </MenuItem>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Menu>
      </Sidebar>
    </>
  );
};
export default SidebarNav;
