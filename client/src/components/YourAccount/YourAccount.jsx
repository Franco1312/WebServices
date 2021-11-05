import React, { useEffect, useState } from "react";

import s from "./YourAccount.module.css";

//-------------- MATERIAL UI -------------------------------------
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
//-------------------------------------------------------
import CardService from "../CardService/CardService";
import { getUserInfo, getUserFavs } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import UserInfo from "./UserInfo/UserInfo";
import Botonera from "./Botonera/Botonera";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Admin from "../Admin/Admin";

export default function YourAccount({ userProfile, profileInfo }) {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    if (userProfile !== true) {
      (async () => {
        dispatch(await getUserInfo());
        dispatch(await getUserFavs());
      })();
    }
  }, [dispatch, userProfile]);

  //BOTONES --> YOUR ORDERS - YOUR FAVS - YOUR SERVICES
  const [viewServices, setViewservices] = useState(false);
  const [viewOrders, setViewOrders] = useState(false);
  const [viewFavs, setViewFavs] = useState(false);
  const [viewAdmin, setViewAdmin] = useState(false);
  //----------------------------------------------

  //MODAL FORM PARA CAMBIAR DATOS
  const [openForm, setOpenForm] = useState(false);
  const [modal, setModal] = useState(false);
  //-----------------------------------

  //-------------------------------
  // eslint-disable-next-line
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div>
      <UserInfo userProfile={userProfile} profileInfo={profileInfo} />

      {!userProfile && (
        <Botonera
          viewServices={viewServices}
          viewOrders={viewOrders}
          viewFavs={viewFavs}
          viewAdmin={viewAdmin}
          setViewFavs={setViewFavs}
          setViewOrders={setViewOrders}
          setViewservices={setViewservices}
          setViewAdmin={setViewAdmin}
          // --------------------------------
          openForm={openForm}
          modal={modal}
          setOpenForm={setOpenForm}
          setModal={setModal}
          user={userData}
        />
      )}
      <div>
        {/* -------------------FAVS------------------------ */}
        {viewFavs &&
          (userData.servicesFavs.length > 0 ? (
            <Container>
              <div>
                <Grid container justifyContent="center" spacing={3}>
                  {userData.servicesFavs.map((s) => (
                    <Grid item key={s.id}>
                      <CardService service={s} />
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Container>
          ) : (
            <div className={s.addFavContainer}>
              <h3>Your Fav-list is currently empty</h3>
              <div className={s.addToFav}>
                <p>
                  Add Services that you like and want to see later by clicking
                  on the
                </p>
                <FavoriteIcon sx={{ marginLeft: 1 }} />
              </div>
            </div>
          ))}
        {/* ------------------------------------------------ */}
        {/* ------------------ORDERS---------------------------- */}
        {viewOrders && (
          <Container>
            <div>
              <h1>YOUR ORDERS</h1>
            </div>
          </Container>
        )}
        {/* ----------------------------------------------------- */}
        {/* -------------------SERVICES-------------------------- */}
        {viewServices &&
          (userData.servicesOwn && userData.servicesOwn.length > 0 ? (
            <div>
              <Container>
                <Grid container justifyContent="center" spacing={3}>
                  {userData.servicesOwn.map((s) => (
                    <Grid item key={s.id}>
                      <CardService service={s} />
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </div>
          ) : (
            <div className={s.addFavContainer}>
              <h3>You are currently not offering any services</h3>
              <div className={s.addToFav}>
                <p>
                  Post Services that you want to offer by clicking on POST
                  SERVICE
                </p>
              </div>
            </div>
          ))}
        {viewAdmin && userData.admin && <Admin />}
      </div>
      {/* ---------------------------------------------- */}
    </div>
  );
}
