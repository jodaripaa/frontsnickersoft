"use client"
import { Button } from '@/components/ui/button';
import { FC, useState } from 'react';

type Props = {};
const CounterPage: FC<Props> = ({ }) => {
    const NUMERO_POR_DEFECTO = 100

    const [numero, actulizarNumero] = useState(NUMERO_POR_DEFECTO)

    const incrementarNumero = () => {
        actulizarNumero(numero + 1)
    }

    const disminuirNumero = () => {
        actulizarNumero(numero - 1)
    }

    const reiniciarNumero = () => {
        actulizarNumero(NUMERO_POR_DEFECTO)
    }

    return (
        <div className=' flex flex-col w-screen h-screen bg-gray-100 justify-center items-center'>
            <div className='flex flex-col w-fit p-8 rounded-2xl bg-white shadow-lg items-center space-y-5'>
                <div>{numero}</div>
                <div className='flex flex-row space-x-2'>
                    <Button onClick={() => disminuirNumero()} className=' bg-blue-500 text-white'>Disminuir</Button>
                    <Button onClick={() => reiniciarNumero()} className=' bg-blue-500 text-white'>Reiniciar</Button>
                    <Button onClick={() => incrementarNumero()} className=' bg-blue-500 text-white'>Incrementar</Button>
                </div>
            </div>
        </div>
    );
};

const suma = (num1: number, num2: number) => {
    return num1 + num2
}

console.log(suma(2, 3))

export default CounterPage;