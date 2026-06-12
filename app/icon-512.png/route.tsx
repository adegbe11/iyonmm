import { ImageResponse } from "next/og";
import { appIcon } from "@/lib/appIcon";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(appIcon(512), { width: 512, height: 512 });
}
