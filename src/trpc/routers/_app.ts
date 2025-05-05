
import { boxesRouter } from '@/modules/boxes/server/procedures';
import { createTRPCRouter } from '../init';
import { slidesRouter } from '@/modules/slides/server/procedures';

export const appRouter = createTRPCRouter({
  boxes: boxesRouter,
  slides: slidesRouter
});

export type AppRouter = typeof appRouter;