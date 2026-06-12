import { ImageResponse } from "next/og";
import { appIcon } from "@/lib/appIcon";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(appIcon(192), { width: 192, height: 192 });
}
