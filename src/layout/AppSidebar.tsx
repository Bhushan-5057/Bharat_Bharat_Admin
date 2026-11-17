"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";


import {
  GridIcon,
  PlugInIcon,
  ChevronDownIcon,
  HorizontaLDots,
} from "@/icons/index";
import { IMGAGES } from "@/components/common/constants/utlis";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { SwatchBook, BoxIcon, HomeIcon, UsersIcon, ImageIcon, Settings2, BookIcon, GraduationCapIcon, CalendarIcon, ActivityIcon, MapPinIcon, FileTextIcon, GalleryHorizontal, VideoIcon, DockIcon, EggFried } from "lucide-react";

type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  onClick?: () => void;
  subItems?: NavItem[];
  pro?: boolean;
  new?: boolean;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Modules",
    icon: <BoxIcon />,
    subItems: [
      { name: "Admin", path: "/admin-table", pro: false, icon: <UsersIcon /> },
      {
        name: "Home",
        icon: <HomeIcon />,
        subItems: [
          { name: "Banner", path: "/banner-table", icon: <ImageIcon /> },
          { name: "Service", path: "/services-table", icon: <Settings2 /> },
          { name: "Office Bearer", path: "/bearer-table", icon: <UsersIcon /> },
        ],
      },
      {
        name: "Header",
        icon: <SwatchBook />,
        subItems: [
          { name: "Certificates", path: "/certificates-table", pro: false, icon: <BookIcon /> },
          { name: "Members", path: "/members-table", pro: false, icon: <UsersIcon /> },
          { name: "Achievements", path: "/achievements-table", pro: false, icon: <GraduationCapIcon /> },
          { name: "Events", path: "/event-table", pro: false, icon: <CalendarIcon /> },
          { name: "Activities", path: "/activity-table", pro: false, icon: <ActivityIcon /> },
          { name: "Our Presence", path: "/city-table", pro: false, icon: <MapPinIcon /> },
          { name: "Blogs", path: "/blogs-table", pro: false, icon: <FileTextIcon /> },
          {
            name: "Gallery",
            icon: <GalleryHorizontal />,
            subItems: [
              { name: "Photos", path: "/gallery/photos-table", pro: false, icon: <ImageIcon /> },
              { name: "Videos", path: "/gallery/videos-table", pro: false, icon: <VideoIcon /> },
            ],
          },
        ],
      },
      {
        name: "Footer",
        icon: <EggFried />,
        subItems: [
          { name: "Donation Details", path: "/donation-table", pro: false, icon: <DockIcon /> },
          { name: "Contact Details", path: "/contact-details-table", pro: false, icon: <MapPinIcon /> },
        ],
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [logoutOpen, setLogoutOpen] = useState(false);

  const showFullLogo = isExpanded || isHovered || isMobileOpen;

  const isActive = useCallback(
    (path: string) => {
      if (!pathname) return false;
      if (pathname === path) return true;

      if (path === "/achievements-table" && pathname.startsWith("/achievements/")) return true;
      if (path === "/city-table" && pathname.startsWith("/cities/")) return true;
      if (path === "/event-table" && pathname.startsWith("/events/")) return true;
      if (path === "/activity-table" && pathname.startsWith("/activities/")) return true;
      if (path === "/blogs-table" && pathname.startsWith("/blogs/")) return true;
      if (path === "/admin-table" && pathname.startsWith("/admins/")) return true;
      if (path === "/services-table" && pathname.startsWith("/services/")) return true;
      if (path === "/members-table" && pathname.startsWith("/members/")) return true;
      if (path === "/donation-table" && pathname.startsWith("/donations/")) return true;
      if (path === "/contact-details-table" && pathname.startsWith("/contact-details/")) return true;
      if (path === "/certificates-table" && pathname.startsWith("/certificates/")) return true;
      if (path === "/gallery/photos-table" && pathname.startsWith("/gallery/photos/")) return true;
      if (path === "/gallery/videos-table" && pathname.startsWith("/gallery/videos/")) return true;
      if (path === "/banner-table" && (pathname.startsWith("/home-section") || pathname.startsWith("/banners/"))) return true;
      if (path === "/bearer-table" && pathname.startsWith("/office-bearers/")) return true;
      return false;
    },
    [pathname]
  );




  const handleSubmenuToggle = (key: string, parentKey: string, itemsLength: number) => {
    setOpenMenus((prev) => {
      const updated = { ...prev };

      for (let i = 0; i < itemsLength; i++) {
        const siblingKey = `${parentKey}${i}`;
        if (siblingKey !== key) {
          updated[siblingKey] = false;
        }
      }

      updated[key] = !prev[key];
      return updated;
    });
  };


  const handleLogout = useCallback(() => {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.clear();

    setLogoutOpen(false);
    router.replace("/signin");
  }, [router]);

  const buildOthersItems = useCallback((): NavItem[] => {
    if (isLoggedIn) {
      return [
        {
          icon: <PlugInIcon />,
          name: "Sign Out",
          onClick: () => setLogoutOpen(true),
        },
      ];
    } else {
      return [
        {
          icon: <PlugInIcon />,
          name: "Authentication",
          subItems: [
            { name: "Sign In", path: "/signin" },
          ],
        },
      ];
    }
  }, [isLoggedIn, handleLogout]);

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main" | "others",
    parentKey = ""
  ): React.ReactNode => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const key = `${parentKey}${menuType}-${index}`;
        const isOpen = !!openMenus[key];

        return (
          <li key={key}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(key, `${parentKey}${menuType}-`, items.length)}
                className={`menu-item group ${isOpen ? "menu-item-active" : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                  }`}
              >
                <span
                  className={`${isOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-500" : ""
                      }`}
                  />
                )}
              </button>
            ) : nav.path ? (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            ) : (
              nav.onClick && (
                <button
                  onClick={nav.onClick}
                  className={`menu-item group menu-item-inactive ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                    }`}
                >
                  <span className="menu-item-icon-inactive">{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </button>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ height: isOpen ? "auto" : "0px" }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {renderMenuItems(nav.subItems, menuType, `${key}-`)}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  useEffect(() => {
    const expandMenusForPath = (
      items: NavItem[],
      parentKey = "",
      menuType = "main"
    ): boolean => {
      let foundActive = false;

      items.forEach((nav, index) => {
        const key = `${parentKey}${menuType}-${index}`;
        const isDirectActive =
          nav.path &&
          (
            pathname === nav.path ||
            (nav.path === "/achievements-table" && pathname.startsWith("/achievements/")) ||
            (nav.path === "/city-table" && pathname.startsWith("/cities/")) ||
            (nav.path === "/event-table" && pathname.startsWith("/events/")) ||
            (nav.path === "/activity-table" && pathname.startsWith("/activities/")) ||
            (nav.path === "/blogs-table" && pathname.startsWith("/blogs/")) ||
            (nav.path === "/admin-table" && pathname.startsWith("/admins/")) ||
            (nav.path === "/services-table" && pathname.startsWith("/services/")) ||
            (nav.path === "/members-table" && pathname.startsWith("/members/")) ||
            (nav.path === "/donation-table" && pathname.startsWith("/donations/")) ||
            (nav.path === "/certificates-table" && pathname.startsWith("/certificates/")) ||
            (nav.path === "/gallery/photos-table" && pathname.startsWith("/gallery/photos/")) ||
            (nav.path === "/gallery/videos-table" && pathname.startsWith("/gallery/videos/")) ||
            (nav.path === "/banner-table" && (pathname.startsWith("/home-section") || pathname.startsWith("/banners/"))) ||
            (nav.path === "/bearer-table" && pathname.startsWith("/office-bearers/"))
          );

        let hasActiveChild = false;

        if (nav.subItems) {

          hasActiveChild = expandMenusForPath(
            nav.subItems,
            `${key}-`,
            menuType
          );
        }

        if (isDirectActive || hasActiveChild) {
          setOpenMenus((prev) => ({ ...prev, [key]: true }));
          foundActive = true;
        }
      });

      return foundActive;
    };

    setOpenMenus({});
    expandMenusForPath(navItems, "", "main");
    expandMenusForPath(buildOthersItems(), "", "others");
  }, [pathname, buildOthersItems]);


  useEffect(() => {
    const hasToken = document.cookie.includes("authToken=");
    setIsLoggedIn(hasToken);
  }, [pathname]);

  return (
    <aside
      className={`fixed  flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          } ${isMobileOpen ? "py-12" : "py-0"}`}
      >
        {!isMobileOpen && (
          <Link
            href="/"
            className={`flex items-center transition-all duration-300 ${
              showFullLogo ? "justify-start" : "lg:justify-center"
            }`}
            aria-label="Bharat Bharati dashboard"
          >
            {showFullLogo ? (
              <Image
                src={IMGAGES.LOGO_LIGHT}
                alt="Bharat Bharati"
                width={190}
                height={48}
                className="mt-5 h-12 w-auto max-w-[190px] object-contain transition-opacity duration-300"
                priority
              />
            ) : (
              <Image
                src={IMGAGES.LOGO_COLLAPSED}
                alt="Bharat Bharati"
                width={40}
                height={40}
                className="mt-5 mb-2 h-10 w-10 object-contain transition-opacity duration-300"
                priority
              />
            )}
          </Link>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(buildOthersItems(), "others")}
            </div>
          </div>
        </nav>
      </div>
      <ConfirmDialog
        open={logoutOpen}
        title="Sign out"
        description="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </aside>
  );
};

export default AppSidebar;

