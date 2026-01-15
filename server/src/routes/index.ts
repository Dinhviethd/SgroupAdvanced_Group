import { Router } from 'express';
import authRoute from './apis/auth.route';
import workspaceRoute from './apis/workspace.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/workspaces', workspaceRoute);
export default router;
