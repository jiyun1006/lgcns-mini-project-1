const withoutAuthUrlList = ["/login", "/signup"];

const authUrlList = ["/posts/new"];
const authPrefixList: string[] = [];

function safeCallbackPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  const pathname = value.split("?")[0];
  if (
    withoutAuthUrlList.includes(pathname) ||
    pathname === "/auth/continue" ||
    pathname === "/auth/remember"
  ) {
    return "/";
  }
  return value;
}

export { authPrefixList, authUrlList, safeCallbackPath, withoutAuthUrlList };
