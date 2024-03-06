import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Analysis(){

    return (
        <>
            <iframe style="background: #F1F5F4;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);width: 100vw; height: 200vh;"  src="https://charts.mongodb.com/charts-frangelevent-qntjm/embed/dashboards?id=604d4367-3852-4f2d-bc59-23974416803b&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale"></iframe>
        </>
    )

}