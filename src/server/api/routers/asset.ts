import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { Status } from "@prisma/client";

export const userRouter = createTRPCRouter({
  isUsernameAvailable: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (user) {
        return false;
      }
      else {
        return true;
      }
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userData = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        image: true,
        location: true,
        linkedin: true,
        github: true,
      },
    });

    const userLinks = await ctx.db.userLink.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        label: true,
        url: true,
      },
    });

    return {
      user: userData,
      links: userLinks,
    };
  }),

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
        id: z.string(),
        icon: z.string().nullish(),
        title: z.string().optional(),
        description: z.string().max(200).nullish(),
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

  getPortfolioStyle: publicProcedure
    .input(
      z.object({
        username: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      const user = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
        select: {
          portfolioStyle: true,
        },
      });
      return user?.portfolioStyle;
    }),

  updatePortfolioStyle: protectedProcedure
    .input(
      z.object({
        themeId: z.string().nullish(),
        background: z.string().optional(),
        nameColor: z.string().optional(),
        descriptionColor: z.string().optional(),
        linkColor: z.string().optional(),
        layoutSize: z.string().optional(),
        elementSpacing: z.string().optional(),
        headerAlignment: z.string().optional(),
        showDescription: z.boolean().optional(),
        showLinks: z.boolean().optional(),
        showLocation: z.boolean().optional(),
        backgroundOverlay: z.string().optional(),
        backgroundImage: z.string().optional(),
        headerStyle: z.string().optional(),
        assetCardBackground: z.string().optional(),
        assetCardBorder: z.boolean().optional(),
        assetCardBorderColor: z.string().optional(),
        assetCardBorderRadius: z.string().optional(),
        assetCardBorderWidth: z.string().optional(),
        assetCardDescriptionColor: z.string().optional(),
        assetCardHoverScale: z.boolean().optional(),
        assetCardHoverShadow: z.boolean().optional(),
        assetCardShadow: z.boolean().optional(),
        assetCardStyle: z.string().optional(),
        assetCardTextColor: z.string().optional(),
        showAssetDescription: z.boolean().optional(),
        showAssetIcon: z.boolean().optional(),
        showAssetType: z.boolean().optional(),

        // Asset visibility
        showAssets: z.boolean().optional(),

        // Footer Settings
        showFooter: z.boolean().optional(),
        footerFixed: z.boolean().optional(),
        footerBackground: z.string().optional(),
        footerBorder: z.boolean().optional(),
        footerBorderColor: z.string().optional(),
        footerBorderWidth: z.string().optional(),
        footerShadow: z.boolean().optional(),
        footerPadding: z.string().optional(),

        // Footer Button Settings
        footerButtonText: z.string().optional(),
        footerButtonUrl: z.string().optional(),
        footerButtonColor: z.string().optional(),
        footerButtonBg: z.string().optional(),
        footerButtonBorder: z.boolean().optional(),
        footerButtonBorderColor: z.string().optional(),
        footerButtonRadius: z.string().optional(),
        footerButtonShadow: z.boolean().optional(),
        footerButtonHoverScale: z.boolean().optional(),
        footerButtonType: z.string().optional(),
        footerButtonEmail: z.string().optional(),
        footerButtonPhone: z.string().optional(),

        // Asset Categorization
        categorizeAssets: z.boolean().optional(),
        assetTabBackground: z.string().optional(),
        assetTabSelectedBg: z.string().optional(),
        assetTabTextColor: z.string().optional(),
        assetTabSelectedTextColor: z.string().optional(),

        // Asset Tab Navigation
        assetTabBorder: z.boolean().optional(),
        assetTabBorderColor: z.string().optional(),
        assetTabHoverBg: z.string().optional(),
        assetTabBorderRadius: z.string().optional(),
        assetTabPadding: z.string().optional(),
        assetTabSpacing: z.string().optional(),
        assetTabShadow: z.boolean().optional(),

        // Asset Card Hover
        assetCardHoverBg: z.string().optional(),
        showEmail: z.boolean().optional(),
        locationColor: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const style = await ctx.db.portfolioStyle.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        update: input,
        create: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return style;
    }),

  getUserPortfolioWithStyle: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUniqueOrThrow({
        where: {
          username: input.username.toLowerCase(),
        },
        select: {
          id: true,
          name: true,
          bio: true,
          image: true,
          linkedin: true,
          github: true,
          location: true, // Add location to select
          portfolioStyle: true,
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
          links: {
            // Add links select
            select: {
              id: true,
              label: true,
              url: true,
            },
          },
          email: true, // Add this
        },
      });

      return {
        header: {
          id: user.id,
          name: user.name,
          image: user.image,
          bio: user.bio,
          linkedin: user.linkedin,
          github: user.github,
          location: user.location, // Add location to header
          email: user.email, // Add this
        },
        style: user.portfolioStyle,
        links: user.links,
        body: user.assets,
      };
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        username: z.string().optional(),
        bio: z.string().nullish(),
        location: z.string().nullish(),
        linkedin: z.string().nullish(),
        github: z.string().nullish(),
        image: z.string().optional(), // Change to optional instead of nullish
        links: z
          .array(
            z.object({
              id: z.string().optional(),
              label: z.string(),
              url: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Only include fields that are explicitly provided
      const updateData = {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.username !== undefined && { username: input.username }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.location !== undefined && { location: input.location }),
        ...(input.linkedin !== undefined && { linkedin: input.linkedin }),
        ...(input.github !== undefined && { github: input.github }),
        ...(input.image !== undefined && { image: input.image }),
      };

      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: updateData,
      });

      // Update links if provided
      if (input.links) {
        // Delete existing links
        await ctx.db.userLink.deleteMany({
          where: { userId: ctx.session.user.id },
        });

        // Create new links
        await ctx.db.userLink.createMany({
          data: input.links.map((link) => ({
            ...link,
            userId: ctx.session.user.id,
          })),
        });
      }

      return user;
    }),

  getStylePresets: publicProcedure.query(async ({ ctx }) => {
    const presets = await ctx.db.stylePreset.findMany({
      where: {
        OR: [{ isPublic: true }, { userId: ctx.session?.user?.id }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });
    return presets;
  }),

  saveStylePreset: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        style: z.any(), // You might want to be more specific with the type
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const preset = await ctx.db.stylePreset.create({
        data: {
          name: input.name,
          style: input.style,
          isPublic: input.isPublic,
          userId: ctx.session.user.id,
        },
      });
      return preset;
    }),

  deleteStylePreset: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const preset = await ctx.db.stylePreset.findUnique({
        where: { id: input.id },
      });

      if (!preset || preset.userId !== ctx.session.user.id) {
        throw new Error("Not authorized to delete this preset");
      }

      await ctx.db.stylePreset.delete({
        where: { id: input.id },
      });

      return preset;
    }),
});
