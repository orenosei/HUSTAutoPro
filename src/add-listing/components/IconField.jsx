import React from 'react'
import {
    FaClipboardList,
    FaTag,
    FaDollarSign,
    FaMoneyBillAlt,
    FaCar,
    FaCheckCircle,
    FaIndustry,
    FaCarSide,
    FaCalendarAlt,
    FaRoad,
    FaCogs,
    FaGasPump,
    FaTachometerAlt,
    FaWrench,
    FaCircle,
    FaPalette,
    FaDoorClosed,
    FaIdCard,
    FaTags,
    FaFileAlt,
  } from 'react-icons/fa';
  
const iconMap = {
    FaClipboardList: <FaClipboardList />,
    FaTag: <FaTag />,
    FaDollarSign: <FaDollarSign />,
    FaMoneyBillAlt: <FaMoneyBillAlt />,
    FaCar: <FaCar />,
    FaCheckCircle: <FaCheckCircle />,
    FaIndustry: <FaIndustry />,
    FaCarSide: <FaCarSide />,
    FaCalendarAlt: <FaCalendarAlt />,
    FaRoad: <FaRoad />,
    FaCogs: <FaCogs />,
    FaGasPump: <FaGasPump />,
    FaTachometerAlt: <FaTachometerAlt />,
    FaWrench: <FaWrench />,
    FaCircle: <FaCircle />,
    FaPalette: <FaPalette />,
    FaDoorClosed: <FaDoorClosed />,
    FaIdCard: <FaIdCard />,
    FaTags: <FaTags />,
    FaFileAlt: <FaFileAlt />,
};
  
function IconField({icon}) {
return (
    <div className='text-blue-500 bg-blue-100 p-1.5 rounded-full'>{iconMap[icon]}</div>
)
}

export default IconField