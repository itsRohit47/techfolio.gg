import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

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

  getUidByUsername: publicProcedure
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
      return user ? user.id : null;
    }),

  getUserBasicData: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
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
          headline: true,
          location: true,
          github: true,
          linkedin: true,
          email: true,
          schedulingLink: true,
        },
      });
    }),

  getUserBio: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: {
          username: {
            equals: input.username,
            mode: "insensitive",
          },
        },
        select: {
          bio: true,
        },
      });
    }),

  updateUserBio: protectedProcedure
    .input(
      z.object({
        bio: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: {
            equals: ctx.session?.user?.username,
            mode: "insensitive",
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          bio: input.bio,
        },
      });
    }),

  updateUserBasicData: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
        headline: z.string(),
        location: z.string(),
        github: z.string(),
        linkedin: z.string(),
        email: z.string(),
        schedulingLink: z.object({
          label: z.string(),
          link: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: {
            equals: ctx.session?.user?.username,
            mode: "insensitive",
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: input.name,
          image: input.image,
          headline: input.headline,
          location: input.location,
          github: input.github,
          linkedin: input.linkedin,
          email: input.email,
          schedulingLink: {
            update: input.schedulingLink,
          },
        },
      });
    }),

  getUserCerts: publicProcedure
    .input(
      z.object({
        uid: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.userCertification.findMany({
        where: {
          userId: {
            equals: input.uid,
          },
        },
      });
    }),

  getUserEducations: publicProcedure
    .input(
      z.object({
        uid: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.education.findMany({
        where: {
          userId: {
            equals: input.uid,
          },
        },
      });
    }),

  addUserEducation: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        university: z.string(),
        degree: z.string(),
        field: z.string(),
        startYear: z.number(),
        endYear: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.education.create({
        data: {
          userId: input.userId,
          universityName: input.university,
          courseName: input.degree,
          fieldOfStudy: input.field,
          startYear: input.startYear,
          endYear: input.endYear,
        },
      });
    }),

  deleteUserEducation: protectedProcedure
    .input(
      z.object({
        eduId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.education.delete({
        where: {
          id: input.eduId,
          userId: ctx.session?.user?.id,
        },
      });
    }),

  updateUserEducation: protectedProcedure
    .input(
      z.object({
        eduId: z.string(),
        university: z.string(),
        degree: z.string(),
        field: z.string(),
        startYear: z.number(),
        endYear: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.education.update({
        where: {
          id: input.eduId,
        },
        data: {
          universityName: input.university,
          courseName: input.degree,
          fieldOfStudy: input.field,
          startYear: input.startYear,
          endYear: input.endYear,
        },
      });
    }),

  getUserExperiences: publicProcedure
    .input(
      z.object({
        uid: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.experience.findMany({
        where: {
          userId: {
            equals: input.uid,
          },
        },
      });
    }),

  deleteUserExperience: protectedProcedure
    .input(
      z.object({
        expId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.experience.delete({
        where: {
          id: input.expId,
          userId: ctx.session?.user?.id,
        },
      });
    }),

  getUserSkills: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const skillList = ctx.db.userSkill.findMany({
        where: {
          userId: {
            equals: input.userId,
          },
        },
        select: {
          skill: true,
        },
      });
      return skillList;
    }),

  deleteUserProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.projects.delete({
        where: {
          id: input.projectId,
          userId: ctx.session?.user?.id,
        },
      });
    }),

  getUserProjects: publicProcedure
    .input(
      z.object({
        uid: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const projects = await ctx.db.projects.findMany({
        where: {
          userId: {
            equals: input.uid,
          },
        },
        include: {
          skills: {
            select: {
              skillId: true,
            },
          },
        },
      });

      const projectDetails = await Promise.all(
        projects.map(async (project) => {
          const skills = await ctx.db.skills.findMany({
            where: {
              id: {
                in: project.skills.map((skill) => skill.skillId),
              },
            },
          });
          return {
            ...project,
            skills,
          };
        }),
      );

      return projectDetails;
    }),

  getSkillsBySearch: publicProcedure
    .input(
      z.object({
        search: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.skills.findMany({
        where: {
          name: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      });
    }),

  //add user skills, create new skill if not exist
  addUserSkill: protectedProcedure
    .input(
      z.object({
        skill: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: {
            equals: ctx.session?.user?.username,
            mode: "insensitive",
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      let skill = await ctx.db.skills.findFirst({
        where: {
          name: {
            equals: input.skill,
          },
        },
      });
      if (!skill) {
        skill = await ctx.db.skills.create({
          data: {
            name: input.skill,
          },
        });
      }
      await ctx.db.userSkill.create({
        data: {
          userId: user.id,
          skillId: skill.id,
        },
      });
    }),

  //delete user skills
  deleteUserSkill: protectedProcedure
    .input(
      z.object({
        skillId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: {
            equals: ctx.session?.user?.username,
            mode: "insensitive",
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      await ctx.db.userSkill.delete({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: input.skillId,
          },
        },
      });
      return true;
    }),

  addEducation: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        university: z.string(),
        degree: z.string(),
        field: z.string(),
        startYear: z.number(),
        endYear: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.education.create({
        data: {
          userId: input.userId,
          universityName: input.university,
          courseName: input.degree,
          fieldOfStudy: input.field,
          startYear: input.startYear,
          endYear: input.endYear,
        },
      });
    }),
});
