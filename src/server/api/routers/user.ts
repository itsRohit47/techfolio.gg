import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  isUserNameAvailable: publicProcedure
    .input(
      z.object({
        username: z.string().min(1).nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: {
            equals: input.username,
            mode: "insensitive",
          },
        },
      });
      return user ? false : true;
    }),

  getUserData: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      console.log("getUserData", input);
      return ctx.db.user.findFirst({
        where: {
          username: {
            equals: input.username,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
          headline: true,
          bio: true,
          location: true,
          links: true,
          email: true,
          skills: true,
          certifications: true,
          projects: true,
        },
      });
    }),
});
