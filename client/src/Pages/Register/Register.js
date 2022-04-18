import React, { useState, useContext, useEffect } from "react";
import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { GoogleLogin } from "react-google-login";
import UserContext from "../../context/UserContext";
import { useHistory } from "react-router-dom";
import ErrorNotice from "../../components/misc/ErrorNotice";
import Particles from "react-particles-js";
import Axios from "axios";
import "./Register.css";

export default function Register() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();
  const [error, setError] = useState(null);
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
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        password2,
      };

      await Axios.post("/users/register", newUser);

      const loginRes = await Axios.post("/users/login", {
        email,
        password,
      });

      console.log(loginRes);

      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user.id,
      });

      localStorage.setItem("auth-token", loginRes.data.token);

      history.push("/app/dashboard");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const responseGoogle = async (res) => {
    try {
      console.log(res);
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
    <div className="register-outer-container">
      <Particles
        canvasClassName="particles-container"
        params={{
          particles: {
            number: {
              value: 150,
              density: {
                enable: true,
                value_area: 1500,
              },
            },
            line_linked: {
              enable: true,
              opacity: 0.1,
            },
            move: {
              direction: "right",
              speed: 0.15,
            },
            size: {
              value: 3,
            },
            opacity: {
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.2,
              },
            },
          },
          interactivity: {
            events: {
              onclick: {
                enable: true,
                mode: "push",
              },
            },
            modes: {
              push: {
                particles_nb: 1,
              },
            },
          },
          retina_detect: true,
        }}
      />
      <div className={`sign-up-container ${error && "error-condition-signup"}`}>
        <Form className="sign-up-form" onSubmit={registerUser}>
          <h2 className="sign-up-header">Sign Up</h2>
          {error && <ErrorNotice message={error} />}
          <Row form>
            <Col>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

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

          <Row form>
            <Col>
              <FormGroup>
                <Label for="password2">Confirm Password</Label>
                <Input
                  type="password"
                  name="password2"
                  id="password2"
                  placeholder="Confirm Password"
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          <Button className="sign-up-btn" type="submit">
            Sign Up
          </Button>
          <p>
            Already have an account? <a className="sign-in-already-btn" onClick={() => history.push("/users/login")}>Sign in here</a>
          </p>
        </Form>
        <div className="social-register">
          <div className="social-btn-container-signup">
            <GoogleLogin
              clientId="575877764975-2s8n98j9tg8ljm218cmusvloqcrlpb9v.apps.googleusercontent.com"
              buttonText="Sign up with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  className="social-btn signup-btn--google"
                >
                  Sign up with Google
                </button>
              )}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
