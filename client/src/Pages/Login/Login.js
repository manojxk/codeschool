import React, { useState, useContext, useEffect } from "react";
import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";
import UserContext from "../../context/UserContext";
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";
import ErrorNotice from "../../components/misc/ErrorNotice";
import Particles from "react-particles-js";
import "./Login.css";
import Axios from "axios";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");

  const history = useHistory();

  const { setUserData } = useContext(UserContext);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");

      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      const tokenRes = await Axios.post("/users/isTokenValid", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (tokenRes.data) {
        const userRes = await Axios.get("/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData({
          token: token,
          user: userRes.data,
        });
        history.push("/app/dashboard");
      }
    };

    checkLoggedIn();
  });

  const LogInUser = async (e) => {
    e.preventDefault();

    try {
      const loginRes = await Axios.post("/users/login", {
        email,
        password,
      });


      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });

      localStorage.setItem("auth-token", loginRes.data.token);

      history.push("/app/dashboard");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const responseGoogle = async (res) => {

    try {

      const googleRes = await Axios.post("/auth/googlelogin", {
        tokenId: res.tokenId,
      });

      setUserData({
        token: googleRes.data.token,
        user: googleRes.data.user.id,
      });

      localStorage.setItem("auth-token", googleRes.data.token);

      history.push("/app/dashboard");
    } catch (error) {

      console.log("responseGoogle -> error", error);
    }
  };



  return (
    <div className="login-outer-container">
      <Particles
        canvasClassName="particles-container"
        params={{
          particles: {
            number: {
              value: 160,
              density: {
                enable: true,
                value_area: 1000,
              },
              line_linked: {
                shadow: {
                  enable: true,
                  color: "#faa",
                  blur: 10,
                },
              },
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
            },
          },
        }}
      />
      <div className={`login-container ${error && "error-condition"}`}>
        <Form className="login-form" onSubmit={LogInUser}>
          <h2>Sign In</h2>
          {error && <ErrorNotice message={error} />}
          <Row form>
            <Col>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row form>
            <Col>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          <Button className="login-btn-regular">Sign In</Button>
          <p>
            Don't have an account? &nbsp;
            <a
              className="sign-in-already-btn"
              onClick={() => history.push("/users/register")}
            >
              Sign up here
            </a>
          </p>
        </Form>
        <div className="social-login">
          <div className="social-btn-container-login">
            <GoogleLogin
              clientId="575877764975-2s8n98j9tg8ljm218cmusvloqcrlpb9v.apps.googleusercontent.com"

              buttonText="Sign in with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  class="social-btn loginBtn--google"
                >
                  Sign in with Google
                </button>
              )}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
