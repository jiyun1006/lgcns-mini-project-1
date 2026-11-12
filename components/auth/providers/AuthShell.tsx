import { connection } from "next/server";
import { AuthProvider } from "@/components/auth/providers/AuthProvider";
import { getServerSession } from "next-auth";
import { verifyAccessToken } from "@/lib/accessJwt";
import { authOptions } from "@/lib/authOptions";
import { getCurrentUser } from "@/lib/current-user";
import StaleSessionSignOut from "@/components/auth/atoms/StaleSessionSignOut";

function requestVersion() {
  return Date.now();
}

export default async function AuthShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? "";
  const verified = accessToken ? await verifyAccessToken(accessToken) : null;
  const user = verified ? await getCurrentUser() : null;

  return (
    <AuthProvider
      accessToken={user ? accessToken : null}
      name={user?.name ?? null}
      imageUrl={user ? `/api/users/${user.id}/profile-image?v=${requestVersion()}` : null}
    >
      {verified && !user && <StaleSessionSignOut />}
      {children}
    </AuthProvider>
  );
}
