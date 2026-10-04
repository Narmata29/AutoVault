import PDFDocument from 'pdfkit';
import prisma from '../../utils/prisma';
import { AppError } from '../../middleware/errorHandler';

export class InvoiceService {
  async generateInvoice(purchaseId: string, userId: string) {
    const purchase = await prisma.purchase.findFirst({
      where: {
        id: purchaseId,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            make: true,
            model: true,
            category: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new AppError('Purchase not found.', 404);
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    doc.fontSize(24).text('AUTOVAULT', { align: 'center' });

    doc
      .fontSize(12)
      .text('Car Dealership Inventory System', { align: 'center' });

    doc.moveDown(2);

    doc.fontSize(18).text('INVOICE');

    doc.moveDown();

    doc
      .fontSize(11)
      .text(`Invoice ID: ${purchase.id}`)
      .text(
        `Date: ${purchase.createdAt.toLocaleDateString('en-IN')}`
      );

    doc.moveDown();

    doc.fontSize(13).text('Customer Details');

    doc
      .fontSize(11)
      .text(`Name: ${purchase.user.name}`)
      .text(`Email: ${purchase.user.email}`);

    doc.moveDown();

    doc.fontSize(13).text('Vehicle Details');

    doc
      .fontSize(11)
      .text(`Vehicle: ${purchase.vehicle.make} ${purchase.vehicle.model}`)
      .text(`Category: ${purchase.vehicle.category}`)
      .text(`Quantity: ${purchase.quantity}`)
      .text(
        `Price per Vehicle: ₹${purchase.priceAtPurchase.toLocaleString(
          'en-IN'
        )}`
      );

    doc.moveDown();

    doc
      .fontSize(16)
      .text(
        `Total Amount: ₹${purchase.totalAmount.toLocaleString('en-IN')}`,
        {
          align: 'right',
        }
      );

    doc.moveDown(3);

    doc
      .fontSize(10)
      .text('Thank you for choosing AutoVault.', {
        align: 'center',
      });

    return doc;
  }
}

export const invoiceService = new InvoiceService();