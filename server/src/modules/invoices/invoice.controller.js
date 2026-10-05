"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceController = exports.InvoiceController = void 0;
const invoice_service_1 = require("./invoice.service");
class InvoiceController {
    async generateInvoice(req, res, next) {
        try {
            const purchaseId = req.params.purchaseId;
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const userId = req.user.id;
            const pdf = await invoice_service_1.invoiceService.generateInvoice(purchaseId, userId);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="invoice-${purchaseId}.pdf"`);
            pdf.pipe(res);
            pdf.end();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InvoiceController = InvoiceController;
exports.invoiceController = new InvoiceController();
