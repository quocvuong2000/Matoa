import { message } from "antd";
import { CalendarCheck, CreditCard, ListChecks } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getInfoService, getShippingCost } from "../../api/Shipping";
import Confirmation from "./Confirmation/Confirmation";
import { getAddress, getDetailAddress } from "./PaymentAPI";
import PaymentDetail from "./PaymentDetail/PaymentDetail";
import classes from "./styles.module.scss";
import AppLoader from "../../components/AppLoader";
import SelectAddress from "./SelectAddress/SelectAddress";

const Payment = () => {
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [address, setAdrress] = useState([]);
  const [addressSelected, setAddressSelected] = useState();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const [shippingCost, setShippingCost] = useState(0);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();
  const currentStateUrl = location.pathname.split("/")[1];
  useEffect(() => {
    window.scrollTo(0, 0);
    setStep(
      currentStateUrl === "checkout" ? 0 : currentStateUrl === "payment" ? 1 : 2
    );
  }, [location.pathname]);

  //GET ADDRESS
  useEffect(() => {
    getAddress(user.currentUser.username)
      .then((res) => {
        //console.log(res[0].addressList);
        setAdrress(res[0].addressList);
      })
      .catch(() => {
        message.error("Loading address fail, you must create one to continue");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user.currentUser.username, navigate, reload]);

  const hanldeSelectAddress = (id) => {
    setLoadingPayment(true);
    getDetailAddress(user.currentUser.username, id)
      .then((res) => {
        console.log("res:", res);
        setAddressSelected(res);
        navigate("/payment");
      })
      .catch(() => {
        message.error("Error when select address");
      })
      .finally(() => {
        setLoadingPayment(false);
      });
  };
  //console.log("shippingCost:", shippingCost);
  const hanldeLoading = (isLoading) => {
    setLoadingPayment(isLoading);
  };

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <div className={classes.paymentContainer}>
          <div className={classes.payment}>
            <div className={classes.paymentHeader}>
              <div
                className={`${classes.title} ${step === 0 && classes.active}`}
              >
                1. Checkout
                <div className={classes.icon}>
                  <CalendarCheck size={28} weight="fill" />
                </div>
              </div>
              <div className={classes.line}></div>
              <div
                className={`${classes.title} ${step === 1 && classes.active}`}
              >
                2. Payment
                <div className={classes.icon}>
                  <CreditCard size={28} weight="fill" />
                </div>
              </div>
              <div className={classes.line}></div>
              <div
                className={`${classes.title} ${step === 2 && classes.active}`}
              >
                3. Confirmation
                <div className={classes.icon}>
                  <ListChecks size={28} weight="fill" />
                </div>
              </div>
            </div>
            {loadingPayment && <AppLoader />}
            <div className={classes.content}>
              {step === 0 && (
                <SelectAddress
                  address={address}
                  hanldeSelectAddress={hanldeSelectAddress}
                  reload={reload}
                  setReload={setReload}
                />
              )}
              {step === 1 && (
                <PaymentDetail
                  setShippingCost={setShippingCost}
                  shippingCost={shippingCost}
                  cart={cart}
                  user={user}
                  address={address}
                  addressSelected={addressSelected}
                  hanldeLoading={hanldeLoading}
                />
              )}
              {step === 2 && (
                <Confirmation
                  address={address}
                  addressSelected={addressSelected}
                  shippingCost={shippingCost}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
