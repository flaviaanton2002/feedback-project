import { usePathname } from "next/navigation";

export default function UseBoardSlug() {
  const pathname = usePathname();
  const result = /^\/board\/([a-z0-9\-]+)(\/.*)?$/.exec(pathname);
  const boardName = result?.[1];
  return boardName;
}
