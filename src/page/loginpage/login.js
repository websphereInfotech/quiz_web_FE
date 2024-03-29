// import {auth} from "../../firebase.config";
import { toast } from "react-toastify";
import { Button, Col, Row } from "react-bootstrap";
// import { FcGoogle } from "react-icons/fc";
import { BsChevronLeft } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
// import { gapi } from "gapi-script";


// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const BaseUrl = process.env.REACT_APP_BASEURL;
// console.log(BaseUrl,"url");
const clientId = process.env.REACT_APP_CLIENTID
// console.log(clientId,"client");

const Login = () => {
  const [showOtpDiv, setShowOtpDiv] = useState(false); // show otp input box
  const [email, setEmail] = useState(""); //set mobile number input
  const [otp, setOtp] = useState(""); // set otp input


  const navigate = useNavigate();
  // otp Generate
  const generateOTP = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}/api/login`,
        { email }
      );
      if (response.data.status === 'Success') {
        toast.success(response.data.message, {
          style: {
            backgroundColor: '#0B0D26'
          }
        })
        setShowOtpDiv(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message, {
        style: {
          backgroundColor: '#0B0D26'
        }
      })
    }
  };
  const otpVerify = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}/api/otp_verify`,
        { email, otp }
      );
      if (response.data.status === 'Success') {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("logincoin", response.data.data.coins);
        sessionStorage.setItem("email", response?.data?.data?.email);
        toast.success(response.data.message, {
          style: {
            backgroundColor: '#0B0D26'
          }
        });
        navigate('/quizplay')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message, {
        style: {
          backgroundColor: '#0B0D26'
        }
      })
    }
  }

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://apis.google.com/js/platform.js';
  //   script.async = true;
  //   script.defer = true;
  //   document.head.appendChild(script);
  
  //   script.onload = () => {
  //     window.gapi.load('auth2', () => {
  //       if (!window.gapi.auth2.getAuthInstance()) {
  //         window.gapi.auth2.init({
  //           client_id:'1006202728998-n5vq7b261hp6434hj0jgpqnscj8qdlq7.apps.googleusercontent.com',
  //           // CallbackURL:'http://localhost:5000/api/signup/google',
  //           // AuthURL:'https://accounts.google.com/o/oauth2/auth',
  //           // AccessTokenURL:'https://oauth2.googleapis.com/token',
  //           // ClientSecret:'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',
  //           // Scope:'openid profile email'
  //         }).then(() => {
  //           console.log('Google API initialized');
  //           // Now, proceed with the signIn call
  //         });
  //         console.log("I>>>>>>>>>>>>>>>>>>>>>>>>>>D");
  //       }
  //     });
  //   };
  // });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  
    script.onload = () => {
      window.gapi.load('auth2', () => {
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init({
            client_id:clientId,
            plugin_name: "chat",
            scope:"openid profile email"
          }).then(() => {
            console.log('Google API initialized');
          });
        }
      });
    };
  }, []);

  const responseGoogle = async (googleUser) => {
    try {
  //     console.log("enter",googleUser.credential);
  // console.log("enter in try");
   
      const idToken = googleUser.credential;
      console.log('tokenId:', idToken);
  
      const apiResponse = await axios.post(
        `${BaseUrl}/api/signup/google`,
           { idToken }
      );
        // console.log(apiResponse,"apirespons");
      if (apiResponse.data.status === 'Success') {
        // console.log("Email sent successfully");
        localStorage.setItem("token", apiResponse.data.token);
        localStorage.setItem("logincoin", apiResponse.data.data.coins);
        sessionStorage.setItem("email", apiResponse?.data?.data?.email);
        navigate('/quizhome')
      } else {
        console.error("Email verification failed");
      }
    } catch (error) {
      // console.log("??????????????????????", error);
      if (error.error === 'popup_closed_by_user') {
        console.log(error,"Popup closed by the user");
      } else {
        console.error("An error occurred during email verification", error);
      }
    }
  };
  
  return (

    <>
      <div>
        {/* Other login form elements */}

      </div>
      <div>
        <Row className="flex ">
          <Col className="md:w-[410px] h-[100%] lg:w-[530px]  py-2 px-2">
            <div className="flex py-[8px] cursor-pointer ">
              <span>
                <Link to="/">
                  <BsChevronLeft className="text-white text-lg  mt-2" />
                </Link>
              </span>
              <Link to={`/quizhome`} className="pl-[10px]">
                <div className="text-[#3FCAFF] text-2xl font-bold	italic font-serif">QuizTime !</div>
              </Link>
            </div>

            {!showOtpDiv && (
              <div>
                <div className="text-center py-10">
                  <div className="text-white font-bold text-18">
                    Join QuizTimeNow now!👋
                  </div>
                  <div className="text-[12px] text-[#8789c3]">
                    Play Quizzes and Win Coins
                  </div>
                </div>

                <form>
                  <div id="recaptcha-container"></div>
                  <div className="text-center">
                    <input type="email" className="bg-[#0a0a2911] text-white border-[3px] border-[#4376c9] border-solid rounded-xl py-[10px] text-center px-8"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="text-center pt-5">
                    <Button
                      className="bg-[#D85B00] text-white font-bold text-[16px] rounded-xl py-[13px] text-center px-[88px]"
                      onClick={generateOTP}
                      value={otp}
                    >
                      GET CODE
                    </Button>
                  </div>
                </form>

                <div className="text-center w-full flex justify-center">
                  <div className=" flex py-[8px] mt-3 px-3  rounded-[5px] cursor-pointer	">
                    {/* <span className="align-middle pt-[2px]">
                      <FcGoogle className="fs-4" />
                    </span>
                    <span  className="font-[400] text-[14px] align-middle pl-2"
                     onClick={(googleUser) => {
                        const idToken = googleUser.getAuthResponse().id_token;
                       console.log(idToken,"demotoken");
                      }}>
                      Sign in with Google
                    </span> */}
                    <GoogleLogin
                      clientId={clientId}
                      buttonText="Sign in with Google"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                  </div>
                </div>
                <div
                  class="w-3/5 mx-auto  my-6"
                  style={{ border: "1px solid #389A06" }}
                ></div>
              </div>
            )}

            {showOtpDiv && (
              <div className="pt-[150px]">
                <div className="text-center">
                  <input
                    className="bg-[#171349] border-[2px] border-[#4376c9] text-white rounded-xl py-[12px] text-center px-8"
                    placeholder="Enter Otp"
                    type="tel"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <div className="text-center pt-5">
                  {/* <Link
                    to={otp ? "/quizplay" : ""}
                    onClick={() => !otp && alert("Please enter OTP")}
                  > */}
                  <Button
                    className={`bg-[#D85B00] text-white font-bold text-[16px] rounded-xl py-[13px] text-center px-[88px]`}
                    onClick={otpVerify}
                  >
                    SUBMIT
                  </Button>
                  {/* </Link> */}
                </div>

                <div
                  class="w-3/5 mx-auto my-6"
                  style={{ border: "1px solid #389A06" }}
                ></div>
              </div>
            )}

            <div className="w-full pl-5 pt-6 my-[85px]">
              <h1 className="w-full font-bold text-lg text-white">
                Play Quiz and Win Coins!
              </h1>
              <ul className="text-[#9b9ba7] text-[14px] list-disc my-3 px-4">
                <li className="mb-2">
                  {" "}
                  Play Quizzes in 25+ categories like GK, Sports, Bollywood,
                  Business, Cricket &amp; more!{" "}
                </li>
                <li className="mb-2"> Compete with lakhs of other players! </li>
                <li className="mb-2"> Win coins for every game </li>
                <li className="mb-2">
                  {" "}
                  Trusted by millions of other quiz enthusiasts like YOU!{" "}
                </li>
              </ul>
            </div>
          </Col>
          <Col className="fixed me-[15%] bg-image">
            <div className="py-16 md:py-10">
              <img className="lg:w-[100%] md:w-[300px] " src={require('../../image/quiz-1.png')} alt=""></img>
            </div>

            <div class="font-bold text-center text-white md:text-sm  big:bottom-12  big:z-[-1]">
              Welcome to QuizTimeNow. Play a quiz and earn coins.
              <p class="font-normal text-2xl pt-4 text-center">
                There's a quiz for everyone!{" "}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default Login;
