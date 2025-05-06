import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { z } from "zod";

export const boxesRouter = createTRPCRouter({
  getBoxes: baseProcedure.query(async () => {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    try {
      let boxes = Array();
      let id = 0;

      const lst = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME || "",
        Delimiter: "/",
      });

      const data = await s3Client.send(lst);
      const folders = data.CommonPrefixes?.map((prefix) => prefix.Prefix) || [];

      for (let i = 0; i < folders.length; i++) {
        if (folders[i]) {
          const folder = {
            title: folders[i]!.split("/")[0],
            url: folders[i]!.split("/")[0],
            id: id++,
          };
          boxes.push(folder);
        }
      }

      return boxes;
    } catch (error) {
      return [];
    }
  }),
  getCubes: baseProcedure
  .input(z.object({ box: z.string() }))
    .query(async ({ input }) => {
      let cubes = Array();
      const name = input.box.slice(input.box.lastIndexOf('/') + 1).replaceAll('%20', ' ').replaceAll('%20', ' ')  
      const s3Client = new S3Client({
        region: process.env.AWS_REGION || "",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        },
      });
  
      try {  
        const command = new ListObjectsV2Command({
          Bucket: process.env.AWS_BUCKET_NAME || "",
          Prefix: `${name}/`,
          Delimiter: "/",
        });
  
        const data = await s3Client.send(command);
        const folders = data.CommonPrefixes?.map((prefix) => prefix.Prefix) || [];
  
        for (let i = 0; i < folders.length; i++) {
          if (folders[i]) {
            const folder = { id: folders[i]!.split("/")[1], name: folders[i]!.split("/")[1] };
            cubes.push(folder);
          }
        }
  
        return cubes;
      } catch (error) {
        return [];
      }
    })
});
