import { db } from "@/db";
import { slides, slideUpdateSchema } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { TRPCError } from "@trpc/server";
import {
  and,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  lt,
  or,
} from "drizzle-orm";
import { z } from "zod";

export const slidesRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ image: z.string() }))
    .query(async ({ input }) => {      
      if(!input.image) {
        return null;
      }
      const image = input.image;
      const [existingSlide] = await db
        .select()
        .from(slides)
        .where(eq(slides.slidename, image));

      if (!existingSlide) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Slide not found",
        });
      }

      return existingSlide;
    }),
  getSlides: baseProcedure
    .input(z.object({ box: z.string(), cube: z.string() }))
    .query(async ({ input }) => {
      const box = input.box
        .slice(input.box.lastIndexOf("/") + 1)
        .replaceAll("%20", " ")
        .replaceAll("%20", " ");
      const cube = input.cube
        .slice(input.cube.lastIndexOf("/") + 1)
        .replaceAll("%20", " ")
        .replaceAll("%20", " ");
      const s3Client = new S3Client({
        region: process.env.AWS_REGION || "",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
      });

      try {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME || "",
          Prefix: `${box}/${cube}/`,
        };

        const command = new ListObjectsV2Command(params);
        const data = await s3Client.send(command);

        const slides = data?.Contents?.filter(
          (item) => !item?.Key?.endsWith("/")
        ).map((item) => ({
          key: item.Key,
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
        }));

        return slides;
      } catch (error) {
        return [];
      }
    }),
  create: baseProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ input }) => {
      const { image } = input;

      const [existingSlide] = await db
        .select()
        .from(slides)
        .where(and(eq(slides.slidename, image)));

      if (existingSlide != null) {
        return existingSlide;
      }

      const slide = await db.insert(slides).values({
        title: "",
        description: "",
        slidename: image,
        people: "",
        approxDate: "",
      });

      return slide;
    }),
  update: baseProcedure
    .input(z.object({ ...slideUpdateSchema.shape, image: z.string() }))
    .mutation(async ({ input }) => {
      const updatedSlide = await db
        .update(slides)
        .set({
          title: input.title,
          description: input.description,
          people: input.people,
          approxDate: input.approxDate,
        })
        .where(eq(slides.slidename, input.image))
        .returning()
        .execute();

      return updatedSlide;
    }),
});
