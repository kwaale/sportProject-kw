import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { url } from "../../App";
import Swal from "sweetalert2";
import {
  removeFromCart,
  changeProductQuantity,
  loadCart,
} from "../../redux/actions/cartActions";
import "./cart.css";

import defaultImg from "../../defaultImgs/imagenotfound.jpg";

import {
  Button,
  Container,
  Typography,
  makeStyles,
} from "@material-ui/core";


/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"; */

//styles
const useStyle = makeStyles({
  item: {
    marginLeft: "auto",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    alignItems: "center",
    background: "#f3f6f7",
  },
  image: {
    height: 150,
    display: "flex",
    justifyContent: "space-between",
  },
});

//function
export default function CartItem(props) {
  const { id, Qty } = props;

  const dispatch = useDispatch();
  const classes = useStyle();


  const [detail, setDetail] = useState({});
  useEffect(() => {
    fetch(`${url}/product/` + id)
      .then((res) => res.json())
      .then((data) => setDetail(data));
  }, [id]);

  async function removeProductFromCart(id){
    await dispatch(removeFromCart(id))

    let user = JSON.parse(localStorage.getItem("storage"));

    if(user?.uid) dispatch(loadCart());
      
    
    Swal.fire(
      {
        text:'eliminado',
        icon: 'error', 
        width:'20rem', 
        timer: '1000', 
        showConfirmButton: false 
      }
    ) 
  }
  

  const handleChangeQuantity = async (e) => {
    const { value } = e.target;
    await dispatch(changeProductQuantity(id, Number(value)));
    await dispatch(loadCart())
  };

  return (
    <div>
      {detail ? (
        <Container className={classes.item}>
          <div>
            <img
              className={classes.image}
              src={detail.images || defaultImg}
              alt={detail.name}
            />
          </div>
          <Typography variant="span">{detail.name}</Typography>
          <Typography variant="span">${detail.price}</Typography>
          <Typography variant="span">{detail.stock}</Typography>

          <input
            type="number"
            defaultValue={Qty > detail.stock ? detail.stock : Qty}
            min={1}
            max={detail.stock}
            onChange={handleChangeQuantity}
          />
          <Button variant="contained" onClick={() => removeProductFromCart(id)}>
            <i class="fa fa-trash" aria-hidden="true"></i>
            borrar
          </Button>
        </Container>
      ) : (
        <Typography>Vacio</Typography>
      )}
    </div>
  );
}
