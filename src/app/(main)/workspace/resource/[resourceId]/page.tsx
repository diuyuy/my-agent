import { ROUTER_PATH } from "@/constants/router-path";
import { auth } from "@/lib/auth";
import { findResourceById } from "@/server/features/rags/rag.service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EmbeddingsList } from "./components/embeddings-list";

type Props = {
  params: Promise<{ resourceId: string }>;
};

export default async function ResourcePage({ params }: Props) {
  const { resourceId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(ROUTER_PATH.LOGIN);
  }

  const resource = await findResourceById(session.user.id, resourceId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">{resource.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="capitalize">{resource.fileType}</span>
          <span>•</span>
          <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <EmbeddingsList
        embeddings={resource.embeddings}
        resourceId={resource.id}
        resourceName={resource.name}
      />
    </div>
  );
}
