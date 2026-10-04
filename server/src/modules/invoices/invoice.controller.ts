import { Request, Response, NextFunction } from "express";
import { invoiceService } from "./invoice.service";

export class InvoiceController {
  async generateInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const purchaseId = req.params.purchaseId as string;
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const userId = req.user.id;

      const pdf = await invoiceService.generateInvoice(purchaseId, userId);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice-${purchaseId}.pdf"`,
      );

      pdf.pipe(res);
      pdf.end();
    } catch (error) {
      next(error);
    }
  }
}

export const invoiceController = new InvoiceController();
