import React from "react";
import { Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./themeconfig";
import NavBar from "./components/NavBar/NavBar";
import Plans from "./components/Plans/Plans";
import Catalogo from "./components/Catalogo/Catalogo";

import ProductDetail from "./components/ProductDetail/ProductDetail";
import Admin from "./components/Admin/Admin";
import Home from "./components/Home/Home";
import EditProduct from "./components/Admin/AdmProducts/EditProduct";
require("dotenv").config();

//Esta constante es para tomar la URL para deploy o en su defecto para desarrollo.
const BASE_URL_API = process.env.REACT_APP_API || "http://localhost:3001";

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Route path="/" component={NavBar} />
        <Route exact path="/" component={Home} />
        <Route path="/asociate" component={Plans} />
        <Route path="/productos" component={Catalogo} />
        <Route path="/producto/:id" component={ProductDetail} />
        <Route path="/admin" component={Admin} />
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
