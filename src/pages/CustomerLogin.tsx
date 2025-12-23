import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CustomerLogin() {
  const [lastMonth, setLastMonth] = useState<number | ''>('');
  const [totalSoFar, setTotalSoFar] = useState<number | ''>('');
  const [billData, setBillData] = useState<any>(null);

  // 1. Move the API URL to the top level of the component
  // This ensures it's available everywhere and easy to debug
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 2. Use the dynamic URL
      const response = await fetch(`${API_BASE_URL}/billing/calculate`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastMonth: Number(lastMonth),
          totalSoFar: Number(totalSoFar),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Calculation failed");
        return;
      }

      const data = await response.json();
      setBillData(data); 
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Could not connect to the billing server. Please check your internet or if the server is awake.");
    }
  };

  const downloadPDF = () => {
    if (!billData) return;

    const doc = new jsPDF();
    const navyBlue: [number, number, number] = [0, 31, 63];

    doc.setFontSize(22);
    doc.setTextColor(navyBlue[0], navyBlue[1], navyBlue[2]);
    doc.text("SMART GAS BILLING", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Official Invoice Receipt", 105, 30, { align: "center" });

    autoTable(doc, {
      startY: 50,
      head: [['Description', 'Value']],
      body: [
        ['Usage for this Month', `${billData.presentMonthUnits} Litres`],
        ['Rate Per Litre', `BDT ${Number(billData.rate).toFixed(2)}`],
        ['Base Subtotal', `BDT ${Number(billData.subtotal).toFixed(2)}`],
        [`VAT (${billData.vatPercentage}%)`, `BDT ${Number(billData.vatAmount).toFixed(2)}`], // Dynamic VAT label
        ['Service Charge', `BDT ${Number(billData.serviceCharge).toFixed(2)}`],
        ['TOTAL PAYABLE', `BDT ${Number(billData.total).toFixed(2)}`],
      ],
      headStyles: {
        fillColor: navyBlue,
        fontSize: 12,
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' }
      },
      didParseCell: (data) => {
        if (data.section === 'head' && data.column.index === 1) {
          data.cell.styles.halign = 'right';
        }
      },
      theme: 'striped',
      styles: {
        fontSize: 11,
        cellPadding: 5,
      }
    });

    doc.save(`GasBill_Receipt.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="flex justify-between items-center px-10 py-5 bg-[#001f3f] shadow-md">
        <div className="text-2xl font-bold text-white tracking-tight">
          Smart <span className="text-blue-400">Gas</span> Billing
        </div>
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-gray-200 hover:text-white font-medium transition">Home</Link>
          <a href="mailto:jayedbinalamgir84@gmail.com" className="text-gray-200 hover:text-white font-medium transition">Contact</a>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center py-12 px-4">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Customer Portal</h1>
          <p className="text-slate-500 text-center mb-8">Enter readings to generate your bill.</p>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Previous Reading (Litre)</label>
                <input
                  type="number"
                  value={lastMonth}
                  onChange={(e) => setLastMonth(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Reading (Litre)</label>
                <input
                  type="number"
                  value={totalSoFar}
                  onChange={(e) => setTotalSoFar(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-[#001f3f] text-white py-4 rounded-xl font-bold shadow-lg transition active:scale-95">
                Generate Bill
              </button>
            </form>

            {billData && (
              <div className="mt-8 pt-6 border-t border-dashed border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Invoice Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-blue-700 font-semibold bg-blue-50 p-2 rounded-lg">
                    <span>Current Usage</span>
                    <span>{billData.presentMonthUnits} L</span>
                  </div>
                  <div className="flex justify-between text-slate-600 px-2 text-sm italic">
                    <span>Applied Rate</span>
                    <span>৳{Number(billData.rate).toFixed(2)} / L</span>
                  </div>
                  <div className="flex justify-between text-slate-600 px-2">
                    <span>Subtotal</span>
                    <span>৳{Number(billData.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 px-2">
                    <span>VAT ({billData.vatPercentage}%)</span>
                    <span>৳{Number(billData.vatAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 px-2">
                    <span>Service Charge</span>
                    <span>৳{Number(billData.serviceCharge).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-[#001f3f] pt-3 border-t px-2">
                    <span>Total Payable</span>
                    <span>৳{Number(billData.total).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadPDF}
                  className="w-full mt-6 flex items-center justify-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white border-t border-slate-200 text-center text-slate-500">
        © 2025 Acme AI Ltd. | Mirpur DOHS, Dhaka
      </footer>
    </div>
  );
}