import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// สมมติว่าคุณมี useAuth สำหรับดึงข้อมูล User
// import { useAuth } from "../../hooks/useAuth"; 

export const genSalesOrderPDF = async (cart: any, subtotal: number, tax: number, grandTotal: number, user: any) => {
  const doc = new jsPDF();
  
  // --- Settings & Mock Data ---
  const storeInfo = {
    name: "Red Store",
    address: "Ramkhamhaeng, Phlabphla, Wang Thonglang, Bangkok 10310",
    phone: "02-XXX-XXXX",
    email: "contact@redstore.com"
  };

  const customerInfo = {
    name: (user?.first_name +  ' '  + user?.last_name) || "Guest Customer",
    address: "99/9 Mockup Village, Sukhumvit Rd., Bangkok 10110", // Mock
    phone: "081-XXX-XXXX", // Mock
    paymentTerm: "30 Days"
  };

  // --- 1. Header & Logo ---
  try {
    // ดึง favicon.png มาใช้ (ระบุ path ให้ถูกต้องตาม public folder)
    doc.addImage("/logo-ico.png", "PNG", 14, 10, 15, 15);
  } catch (e) {
    console.error("Logo not found");
  }

  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text("SALES ORDER", 140, 20); // ชิดขวาบน

  // ข้อมูลร้าน (ซ้าย)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(storeInfo.name, 14, 32);
  doc.setFont("helvetica", "normal");
  doc.text(storeInfo.address, 14, 37);
  doc.text(`Tel: ${storeInfo.phone}`, 14, 42);

  // ข้อมูล Order (ขวา)
  const orderDate = new Date().toLocaleDateString('en-GB');
  doc.text(`Order No: SO-${Date.now().toString().slice(-6)}`, 140, 32);
  doc.text(`Date: ${orderDate}`, 140, 37);
  doc.text(`Payment Term: ${customerInfo.paymentTerm}`, 140, 42);

  // --- 2. Customer Information Section ---
  doc.setDrawColor(200);
  doc.line(14, 48, 196, 48); // เส้นคั่น

  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.text(customerInfo.name, 14, 60);
  doc.text(customerInfo.address, 14, 65);
  doc.text(`Tel: ${customerInfo.phone}`, 14, 70);

  // --- 3. Items Table ---
  const tableColumn = ["Description", "Price (THB)", "Qty", "Amount"];
  const tableRows = cart.cart_items.map((item: any) => [
    item.products?.name || "Product",
    Number(item.products?.price).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    item.quantity,
    (Number(item.products?.price) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 }),
  ]);

  autoTable(doc, {
    startY: 80,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] }, // Red Store Theme
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'center' },
      3: { halign: 'right' },
    }
  });

  // --- 4. Summary Section ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const summaryX = 130;

  doc.setFontSize(10);
  doc.text("Subtotal:", summaryX, finalY);
  doc.text(`${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 196, finalY, { align: "right" });

  doc.text("VAT (7%):", summaryX, finalY + 7);
  doc.text(`${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 196, finalY + 7, { align: "right" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total (THB):", summaryX, finalY + 15);
  doc.text(`${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 196, finalY + 15, { align: "right" });

  // --- 5. Footer ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your business!", 105, finalY + 30, { align: "center" });

  // บันทึกไฟล์
  doc.save(`SalesOrder_${customerInfo.name.replace(/\s+/g, '_')}.pdf`);
};