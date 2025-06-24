import { Button } from "@/components/custom/button";
import { Separator } from "@/components/ui/separator";
import React from "react";


export function RCTable(){
    return(
        <div>
            <div className="my-4">
                <h1 className="font-bold ">Clientes Registrados</h1>
                <p>1 500</p>
            </div>

            <Separator className="my-2 text-black"/>
            <div className="grid grid-cols-2 justify-between">
                <div><Button></Button></div>

            </div>
        </div>
    )
}