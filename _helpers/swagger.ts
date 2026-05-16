import express from 'express';
const router = express.Router();

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const swaggerPath = path.join(__dirname, '../../swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;