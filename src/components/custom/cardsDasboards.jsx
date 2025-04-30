import React from "react";
import { Button } from '@/components/custom/button';
import { TbTrash, TbEye, TbEdit, TbFileText } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const ProgramCard = ({
    cardname,
    cardcantidad,
}) => {


    return (
        <div className="border border-slate-700 rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold">{cardname}</h3>
                <p className="text-gray-600">Cantidad: {cardcantidad}</p>
            </div>
        </div>
    );
};

export default ProgramCard;