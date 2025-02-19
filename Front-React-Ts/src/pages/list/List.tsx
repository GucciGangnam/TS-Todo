// IMPORTS 
// style 
import "./List.css";
// React
import React, { useState, useEffect } from "react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/slices/userSlice";
import { selectLists, addTempList, updateTempList, removeTempList } from "../../redux/slices/listsSlice";
// RRD
import { useNavigate, useParams } from "react-router-dom";

// Components

// Variables
const apiUrl = import.meta.env.VITE_API_URL;

//COMPONENT//

export const List = () => {
const navigate = useNavigate();
const dispatch = useDispatch();


    return (
        <div className="List">
            <h1>List </h1>
        </div>
    )
}