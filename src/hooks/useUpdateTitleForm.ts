import { UpdateConversationTitleSchema } from "@/schemas/conversation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UpdateTitleFormData = z.infer<typeof UpdateConversationTitleSchema>;

export const useUpdateTitleForm = (defaultTitle: string) => {
  return useForm<UpdateTitleFormData>({
    resolver: zodResolver(UpdateConversationTitleSchema),
    defaultValues: {
      title: defaultTitle,
    },
  });
};
