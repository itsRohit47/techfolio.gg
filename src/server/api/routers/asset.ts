import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { Status } from "@prisma/client";

export const userRouter = createTRPCRouter({
  getAssets: protectedProcedure.query(async ({ ctx }) => {
    const assets = await ctx.db.asset.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        icon: true,
        status: true,
      },
    });
    return assets;
  }),

  getAsset: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const asset = await ctx.db.asset.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
      return asset;
    }),

  addAsset: protectedProcedure
    .input(
      z.object({
        type: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const asset = await ctx.db.asset.create({
        data: {
          type: input.type,
          title: input.title,
          description: input.description,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return asset;
    }),

  deleteAsset: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const asset = await ctx.db.asset.delete({
        where: {
          id: input.id,
        },
      });
      return asset;
    }),

  updateAsset: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        icon: z.string().optional(),
        title: z.string().optional(),
        description: z.string().nullish(),
        tags: z.array(z.string()).optional(),
        media: z.array(z.string()).optional(),
        body: z.string().nullish(),
        status: z.nativeEnum(Status),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const asset = await ctx.db.asset.update({
        where: {
          id: input.id,
        },
        data: {
          icon: input.icon,
          title: input.title,
          description: input.description,
          tags: input.tags,
          media: input.media,
          body: input.body,
          status: Status[input.status],
        },
      });
      return asset;
    }),

  getUserPortfolio: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUniqueOrThrow({
        where: {
          username: input.username,
        },
        select: {
          id: true,
          name: true,
          bio: true,
          image: true,
          linkedin: true,
          github: true,
          assets: {
            where: {
              status: Status.PUBLISHED,
            },
            select: {
              id: true,
              type: true,
              title: true,
              description: true,
              icon: true,
              status: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        header: {
          name: user.name,
          image: user.image,
          bio: user.bio,
          linkedin: user.linkedin,
          github: user.github,
        },
        body: user.assets,
      };
    }),
});
