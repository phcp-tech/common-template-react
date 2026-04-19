/**
 * Simplified Chinese translations for the template.
 * Replace placeholder values with your own content.
 * Constraint: must NOT import from features/ or pages/.
 */
import type { MessageSchema } from "./types";

export const zhHans: MessageSchema = {
  header: {
    title: "我的应用",
    subtitle: "我的应用",
    nav: { home: "首页" },
    localeLabel: "语言",
    themeMode: { dark: "深色模式", light: "浅色模式" },
  },
  home: {
    heading: "欢迎",
    description: "这是一个模板，请替换为您自己的内容。",
  },
  footer: {
    copyright: "版权所有 © 您的公司",
    links: "链接",
    community: "社区",
    legalHeading: "法律",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
  },
  notFound: {
    title: "页面未找到",
    message: "您访问的页面不存在或已被移动。",
    goHome: "返回首页",
  },
  contentCard: {
    contentNotAvailable: "内容暂不可用。",
  },
};
