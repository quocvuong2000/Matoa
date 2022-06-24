import { Button, Form, Input, message } from "antd";
import "firebase/auth";
import { Phone } from "phosphor-react";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { updatePhone } from "../../../api/User";
import firebase from "../../../services/firebase";
import s from "./styles.module.scss";

const UpdatePhone = () => {
  const [otp, setOtp] = useState(false);
  const [numotp, setNumOtp] = useState(0);
  const user = useSelector((state) => state.user);
  const [phone, setPhone] = useState(0);
  const handleChangeOtp = (otp) => {
    setNumOtp(otp);
  };

  // const handleSendOtp = () => {
  //   let recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
  //     size: "invisible",
  //     callback: (response) => {
  //       console.log("response:", response);
  //     },
  //     default: "VN",
  //   });
  //   let number = "+84348098023";

  //   firebase
  //     .auth()
  //     .signInWithPhoneNumber(number, recaptcha)
  //     .then((result) => {
  //       result.confirm(otp).then((res) => {
  //         console.log(res.user);
  //       });
  //     })
  //     .catch((err) => {
  //       alert(err);
  //     });
  // };

  const handleUpdatePhone = () => {
    updatePhone(user.currentUser._id, phone).then((res) => {
      if (res) {
        message.success("Update success");
      }
    });
  };
  return (
    <div className={s.container}>
      <div id="recaptcha-container"></div>
      <div className={s.form}>
        <p className={s.title}>Your phone</p>
        {otp === false ? (
          <Form className={s.form_phone} onFinish={handleUpdatePhone}>
            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  type: "regexp",
                  pattern: new RegExp(/\d+/g),
                  message: "Wrong format!",
                },
              ]}
            >
              <Input
                placeholder="Field your phone number"
                className={s.input_phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                prefix={
                  <Phone size={20} weight="thin" className={s.icon_phone} />
                }
              />
              <small className={s.small_text}>
                Mã xác thực (OTP) sẽ được gửi đến số điện thoại này để xác minh
                số điện thoại là của bạn
              </small>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={s.update_phone}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            className={s.form_phone}
            onFinish={() => {
              setOtp(false);
            }}
          >
            <OtpInput value={numotp} onChange={handleChangeOtp} numInputs={6} />

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={s.update_phone}
                onClick={() => {
                  setOtp(false);
                }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default UpdatePhone;
