import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { invoiceController } from './invoice.controller';

const router = Router();

router.get(
  '/:purchaseId',
  authenticate,
  (req, res, next) => {
    invoiceController.generateInvoice(req, res, next);
  }
);

export default router;