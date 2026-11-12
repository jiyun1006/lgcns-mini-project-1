import { prisma } from "@/lib/prisma";
import { isObjectId } from "@/lib/current-user";

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  if (!isObjectId(userId)) return new Response(null, { status: 404 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileImageUrl: true, isProfilePublic: true },
  });
  const dataUrl = user?.isProfilePublic === false ? null : user?.profileImageUrl;
  if (dataUrl?.startsWith("https://") || dataUrl?.startsWith("http://")) {
    return Response.redirect(dataUrl, 307);
  }
  const match = /^data:(image\/(?:png|jpeg));base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl ?? "");
  if (!match) return new Response(null, { status: 404 });

  const bytes = Buffer.from(match[2], "base64");
  return new Response(bytes, {
    headers: {
      "Content-Type": match[1],
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
