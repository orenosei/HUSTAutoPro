import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function FinancialCalculator({ carDetail }) {
  const [carPrice, setCarPrice] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Set giá xe ban đầu từ carDetail
  useEffect(() => {
    if (carDetail?.sellingPrice) {
      setCarPrice(carDetail.sellingPrice);
    }
  }, [carDetail]);

  // Hàm định dạng số với dấu phẩy
  const formatWithCommas = (number) => {
    return number.toLocaleString('en-US');
  };

  const CalculateMonthlyPayment = () => {
    if (carPrice <= 0 || loanTerm <= 0 || interestRate < 0 || downPayment < 0 || downPayment > carPrice) {
      alert('Vui lòng nhập giá trị hợp lệ!');
      return;
    }

    const principal = carPrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;

    const monthlyPayment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    setMonthlyPayment(Number(monthlyPayment.toFixed(2)));
  };

  const formattedPrice = monthlyPayment > 0 ? formatWithCommas(Math.floor(monthlyPayment)) : 'N/A';

  return (
    <div className="p-10 rounded-xl bg-white shadow-md mt-6 border border-gray-200">
      <h2 className="text-2xl font-semibold">Tính Toán Chi Phí Xe</h2>

      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <label>Giá Xe Tham Khảo (VNĐ)</label>
          <Input
            type="number"
            className="border-gray-200 shadow-md"
            onChange={(e) => setCarPrice(Number(e.target.value))}
            value={carPrice}
          />
        </div>
        <div className="w-full">
          <label>Lãi Suất (%)</label>
          <Input
            type="number"
            className="border-gray-200 shadow-md"
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <label>Thời Hạn Vay (Tháng)</label>
          <Input
            type="number"
            className="border-gray-200 shadow-md"
            onChange={(e) => setLoanTerm(Number(e.target.value))}
          />
        </div>
        <div className="w-full">
          <label>Trả Trước</label>
          <Input
            type="number"
            className="border-gray-200 shadow-md"
            onChange={(e) => setDownPayment(Number(e.target.value))}
          />
        </div>
      </div>

      {monthlyPayment > 0 && (
        <h2 className="font-medium text-xl mt-5">
          Số Tiền Phải Trả Hàng Tháng Là:
          <span className="text-3xl font-bold"> {formattedPrice} VNĐ</span>
        </h2>
      )}
      <Button
        className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white"
        size="lg"
        onClick={CalculateMonthlyPayment}
      >
        Tính Toán
      </Button>
    </div>
  );
}

export default FinancialCalculator;
