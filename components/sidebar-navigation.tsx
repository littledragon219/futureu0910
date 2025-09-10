// components/sidebar-navigation.tsx
"use client";

import { useInterfaceStore } from "@/lib/store/useInterfaceStore";
import { Home, BarChart, History, Settings, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

// 1. 将主要导航和次要导航（如设置）分开
const mainNavItems = [
  { href: "/", icon: Home, label: "主页" },
  { href: "/learning-report", icon: BarChart, label: "学习报告" },
  { href: "/practice-history", icon: History, label: "练习记录" },
];

const userEmail = "agonyderong@gmail.com"; // 您可以从用户状态中获取

export function SidebarNavigation() {
  const { isSidebarCollapsed, toggleSidebar } = useInterfaceStore();

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col h-full bg-background border-r transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* ===== 顶部: 品牌 Logo ===== */}
      <div className={clsx("flex items-center h-20 px-4", 
        !isSidebarCollapsed ? 'justify-start' : 'justify-center' 
      )}>
        <img src="/logo.png" alt="FutureU Logo" className={clsx("transition-all duration-300", !isSidebarCollapsed ? 'h-10 w-auto' : 'h-9 w-auto')} />
        {!isSidebarCollapsed && <span className="ml-3 text-xl font-bold">FutureU</span>}
      </div>

      {/* ===== 中部: 主要导航 (使用 flex-1 占满剩余空间) ===== */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {mainNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={clsx(
              "flex items-center w-full h-12 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-lg",
              { "justify-start px-4": !isSidebarCollapsed, "justify-center": isSidebarCollapsed }
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isSidebarCollapsed && <span className="ml-4">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* ===== 底部: 用户信息 & 设置 ===== */}
      <div className="border-t p-2">
        <Link
          href="/settings"
          className={clsx(
            "flex items-center w-full h-16 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-lg",
            { "p-2": !isSidebarCollapsed, "justify-center": isSidebarCollapsed }
          )}
        >
          {/* 这里可以放用户头像 */}
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted-foreground/20 text-foreground font-bold">
            A
          </div>
          {!isSidebarCollapsed && (
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-foreground truncate">Agony</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          )}
        </Link>
      </div>

      {/* ===== 最底部: 收缩按钮 ===== */}
      <div className="border-t p-2">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full h-10 text-muted-foreground hover:bg-muted rounded-lg"
        >
          {isSidebarCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </button>
      </div>
    </aside>
  );
}