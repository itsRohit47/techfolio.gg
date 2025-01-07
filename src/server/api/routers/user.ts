import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { link } from "fs";

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

  getUserTemplate: publicProcedure
    .input(
      z.object({
        username: z.string().nullish(),
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
        select: {
          template: true,
        },
      });
      return user?.template;
    }),

  setUserTemplate: protectedProcedure
    .input(
      z.object({
        template: z.number(),
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
          template: input.template,
        },
      });
    }),

  getUserBasicData: publicProcedure
    .input(
      z.object({
        username: z.string().nullish(),
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
          bio: true,
        },
      });
    }),

  updateUserBasicData: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string().nullish(),
        headline: z.string().nullish(),
        location: z.string().nullish(),
        bio: z.string().nullish(),
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
          bio: input.bio,
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
          const skills = project
            ? await ctx.db.skills.findMany({
                where: {
                  id: {
                    in: project.skills.map((skill) => skill.skillId),
                  },
                },
              })
            : [];
          return {
            ...project,
            skills,
          };
        }),
      );

      return projectDetails;
    }),

  addProject: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        body: z.string(),
        icon: z.string().nullish(),
        skills: z.array(z.string()),
        link: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.projects.create({
        data: {
          userId: ctx.session?.user?.id,
          title: input.title,
          description: input.description,
          body: input.body,
          icon: input.icon,
          links: input.link,
          skills: {
            create: input.skills.map((skill) => ({
              skill: {
                connectOrCreate: {
                  where: {
                    name: skill,
                  },
                  create: {
                    name: skill,
                  },
                },
              },
            })),
          },
        },
      });

      // Add skills to userSkills if not already present
      for (const skillName of input.skills) {
        let skill = await ctx.db.skills.findFirst({
          where: {
            name: skillName,
          },
        });

        if (!skill) {
          skill = await ctx.db.skills.create({
            data: {
              name: skillName,
            },
          });
        }

        const userSkill = await ctx.db.userSkill.findFirst({
          where: {
            userId: ctx.session?.user?.id,
            skillId: skill.id,
          },
        });

        if (!userSkill) {
          await ctx.db.userSkill.create({
            data: {
              userId: ctx.session?.user?.id,
              skillId: skill.id,
            },
          });
        }
      }

      return project;
      return project;
    }),

  getEducationById: publicProcedure
    .input(
      z.object({
        educationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.education.findFirst({
        where: {
          id: input.educationId,
        },
      });
    }),

  getExperienceById: publicProcedure
    .input(
      z.object({
        experienceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.experience.findFirst({
        where: {
          id: input.experienceId,
        },
      });
    }),

  updateProjectOrder: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        order: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.projects.update({
        where: {
          id: input.projectId,
        },
        data: {
          order: input.order,
        },
      });
    }),

  getProjectById: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.projects.findFirst({
        where: {
          id: input.projectId,
        },
        include: {
          skills: {
            select: {
              skillId: true,
            },
          },
        },
      });
      const skills = project
        ? await ctx.db.skills.findMany({
            where: {
              id: {
                in: project.skills.map((skill) => skill.skillId),
              },
            },
          })
        : [];
      return {
        ...project,
        skills,
      };
    }),

  updateEducation: protectedProcedure
    .input(
      z.object({
        educationId: z.string(),
        university: z.string(),
        degree: z.string(),
        field: z.string(),
        startYear: z.number(),
        endYear: z.number(),
        uniLogo: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.education.update({
        where: {
          id: input.educationId,
        },
        data: {
          universityName: input.university,
          courseName: input.degree,
          fieldOfStudy: input.field,
          startYear: input.startYear,
          endYear: input.endYear,
          uniLogo: input.uniLogo,
        },
      });
    }),

  updateExperience: protectedProcedure
    .input(
      z.object({
        experienceId: z.string(),
        logo: z.string().nullish(),
        title: z.string(),
        company: z.string(),
        companuUrl: z.string().nullish(),
        location: z.string(),
        startDate: z.number(),
        endDate: z.number().nullish(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.experience.update({
        where: {
          id: input.experienceId,
        },
        data: {
          companyLogo: input.logo,
          title: input.title,
          company: input.company,
          companyUrl: input.companuUrl,
          location: input.location,
          startYear: input.startDate,
          endYear: input.endDate,
          description: input.description,
        },
      });
    }),

  updateProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        description: z.string(),
        body: z.string(),
        icon: z.string().nullish(),
        skills: z.array(z.string()),
        link: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.projects.update({
        where: {
          id: input.projectId,
        },
        data: {
          title: input.title,
          description: input.description,
          body: input.body,
          icon: input.icon,
          links: input.link,
          skills: {
            deleteMany: {},
            create: input.skills.map((skill) => ({
              skill: {
                connectOrCreate: {
                  where: {
                    name: skill,
                  },
                  create: {
                    name: skill,
                  },
                },
              },
            })),
          },
        },
      });

      // Add skills to userSkills if not already present
      for (const skillName of input.skills) {
        let skill = await ctx.db.skills.findFirst({
          where: {
            name: skillName,
          },
        });

        if (!skill) {
          skill = await ctx.db.skills.create({
            data: {
              name: skillName,
            },
          });
        }

        const userSkill = await ctx.db.userSkill.findFirst({
          where: {
            userId: ctx.session?.user?.id,
            skillId: skill.id,
          },
        });

        if (!userSkill) {
          await ctx.db.userSkill.create({
            data: {
              userId: ctx.session?.user?.id,
              skillId: skill.id,
            },
          });
        }
      }

      return project;
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

  updateUserSkills: protectedProcedure
    .input(
      z.object({
        skills: z.array(z.string()),
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

      // Get current skills
      const currentSkills = await ctx.db.userSkill.findMany({
        where: {
          userId: user.id,
        },
        select: {
          skill: true,
        },
      });

      const currentSkillNames = currentSkills.map(
        (userSkill) => userSkill.skill.name,
      );

      // Determine skills to add and remove
      const skillsToAdd = input.skills.filter(
        (skill) => !currentSkillNames.includes(skill),
      );
      const skillsToRemove = currentSkillNames.filter(
        (skill) => !input.skills.includes(skill),
      );

      // Remove skills
      await ctx.db.userSkill.deleteMany({
        where: {
          userId: user.id,
          skill: {
            name: {
              in: skillsToRemove,
            },
          },
        },
      });

      // Add new skills
      for (const skillName of skillsToAdd) {
        let skill = await ctx.db.skills.findFirst({
          where: {
            name: skillName,
          },
        });

        if (!skill) {
          skill = await ctx.db.skills.create({
            data: {
              name: skillName,
            },
          });
        }

        await ctx.db.userSkill.create({
          data: {
            userId: user.id,
            skillId: skill.id,
          },
        });
      }

      return true;
    }),

  addEducation: protectedProcedure
    .input(
      z.object({
        university: z.string(),
        degree: z.string(),
        field: z.string(),
        startYear: z.number(),
        endYear: z.number(),
        uniLogo: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.education.create({
        data: {
          userId: ctx.session?.user?.id,
          universityName: input.university,
          courseName: input.degree,
          fieldOfStudy: input.field,
          startYear: input.startYear,
          endYear: input.endYear,
          uniLogo: input.uniLogo,
        },
      });
    }),

  addExperience: protectedProcedure
    .input(
      z.object({
        logo: z.string().nullish(),
        title: z.string(),
        company: z.string(),
        location: z.string(),
        startDate: z.number(),
        endDate: z.number().nullish(),
        description: z.string(),
        url: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.experience.create({
        data: {
          userId: ctx.session?.user?.id,
          companyLogo: input.logo,
          title: input.title,
          company: input.company,
          location: input.location,
          startYear: input.startDate,
          endYear: input.endDate,
          description: input.description,
          companyUrl: input.url,
        },
      });
    }),

  updateIneedThis: protectedProcedure
    .input(
      z.object({
        caseNum: z.number(),
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
          iNeedThis: input.caseNum,
        },
      });
    }),
});
