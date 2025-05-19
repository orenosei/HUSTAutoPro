import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


function FinancialCalculator({carDetail}) {

    const [carPrice, setCarPrice] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [loanTerm, setLoanTerm] = useState(0);
    const [downPayment, setDownPayment] = useState(0);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const CalculateMonthlyPayment = () => {
        const principal = carPrice - downPayment;
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm;

        const monthlyPayment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

        console.log("Monthly Payment: ", monthlyPayment);
        setMonthlyPayment(monthlyPayment.toFixed(2));
        return monthlyPayment.toFixed(2);
    }

  return (
    <div className="p-10 rounded-xl bg-white shadow-md mt-6 border border-gray-200">
        <h2 className="text-2xl font-semibold">Financial Calculator</h2>

        <div className='flex gap-5 mt-5'>
            <div className="w-full">
                <label>Price $</label>
                <Input type="number" className='border-gray-200 shadow-md ' onChange={(e)=>setCarPrice(e.target.value)}/>
            </div>
            <div className="w-full">
                <label>Interest Rate</label>
                <Input type="number" className='border-gray-200 shadow-md ' onChange={(e)=>setInterestRate(e.target.value)}/>
            </div>
        </div>

        <div className='flex gap-5 mt-5'>
            <div className="w-full">
                <label>Loan Term (Months)</label>
                <Input type="number" className='border-gray-200 shadow-md ' onChange={(e)=>setLoanTerm(e.target.value)}/>
            </div>
            <div className="w-full">
                <label>Down Payment</label>
                <Input type="number" className='border-gray-200 shadow-md ' onChange={(e)=>setDownPayment(e.target.value)}/>
            </div>
        </div>
        { monthlyPayment > 0 && 
        <h2 className='font-medium text-2xl mt-5'>Your Monthly Payment Is:  
            <span className='text-4xl font-bold'>   {monthlyPayment} $</span>
        </h2>
    }
        <Button className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white" size="lg"  
        onClick={CalculateMonthlyPayment}
        >Calculate</Button>
    </div>
  )
}

export default FinancialCalculator