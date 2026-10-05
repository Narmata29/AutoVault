"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const invoice_controller_1 = require("./invoice.controller");
const router = (0, express_1.Router)();
router.get('/:purchaseId', auth_1.authenticate, (req, res, next) => {
    invoice_controller_1.invoiceController.generateInvoice(req, res, next);
});
exports.default = router;
