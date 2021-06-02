import { Button, Container, Row, Col, Form } from 'react-bootstrap';
// import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

// import PageOne from './PageOne';
import React, { useRef, useState } from 'react';
import { Headline, Message, Title } from './App.style';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import firebase from 'firebase/app';

const { Group, Control, Text } = Form;

const { REACT_APP_CAPTCHA_KEY: captchaKey } = process.env;

type formValues = {
  fullName: string;
  email: string;
  optIn: boolean;
  timeStamp: Date;
};

export default function App() {
  const [captchaSuccess, setCaptchaSuccess] = useState(false)
  const reCapRef = useRef<ReCAPTCHA>();
  const { register, handleSubmit } = useForm<formValues>();

  const signUp = handleSubmit(async ({ fullName, email }) => {
    try {
      const token = await reCapRef.current.executeAsync();

      reCapRef.current.reset();

      const peopleCollection = firebase.firestore().collection('people');
      if (token) {
        await peopleCollection.add({
          fullName,
          email,
          timeStamp: new Date(),
          token,
        });
        setCaptchaSuccess(true);
      } else {
        alert(
          "Oof! Our system thinks that you're a robot. Help us prove it wrong."
        );
      }
    } catch ({ message }) {
      alert('Something Failed, Please Try Again!');
      console.error(message);
    }
  });
  if(captchaSuccess){
    return(
      <Container fluid="sm" className="align-middle h-100 d-flex py-5 align-items-center justify-content-md-center overflow-auto">
        <Col className="text-center">
          <Title>Thanks for signing the petition!</Title>
          <Message>
            <Headline>
              You have helped us along in our mission to hear Boris&apos;s story.
            </Headline>
            <Headline>
              We will send you an email when the event is planned.
            </Headline>
            <Headline>
              Please feel free to jump in the <a href="https://www.clubhouse.com/room/xp9ODK4K">Boris room</a>
            </Headline>
          </Message>
        </Col>
      </Container>
    )
  }
  return (
    <Container fluid="sm" className="align-middle">
      <ReCAPTCHA sitekey={captchaKey} size="invisible" ref={reCapRef} />
      <Row className="vh-100 d-flex py-5 align-items-center justify-content-md-center overflow-auto">
        <Col className="text-center">
          <Title>Hi, help us welcome Boris!</Title>
          <Message>
            <Headline>
              Boris Volynov is the last living member of humanity’s first group
              of space travelers.
            </Headline>
            <Headline>
              As we leap out of our cosmic cradle, it is important to remember
              the pioneers who took the first steps. And their sacrifices along
              the way.
            </Headline>
            <Headline>
              Boris is one of these pioneers with one heck of a story. And we’re
              hoping that he’ll honor us by telling us his story.
            </Headline>
            <Headline>
              We want to preserve this legacy for posterity.
            </Headline>
          </Message>

            <Form onSubmit={signUp} className="mt-4 input-group-large">
              <Group controlId="formBasicInfo">
                <Form.Control
                  size="lg"
                  placeholder="Name"
                  {...register('fullName', { required: true })}
                />
              </Group>
              <Group controlId="formBasicEmail">
                <Control
                  size="lg"
                  type="email"
                  placeholder="Your Email (we pinky promise to never spam)"
                  {...register('email')}
                />
                <Text className="text-muted">
                  We&apos;ll never share your email with anyone else.
                </Text>
              </Group>
              {/* <Group controlId="formBasicCheckbox">
                <Check
                  type="checkbox"
                  label="Check me out"
                  {...register('optIn')}
                />
              </Group> */}
              <Button size="lg" variant="dark" type="submit" className="mt-4" block>
                Submit
              </Button>
            </Form>

        </Col>
      </Row>
      {/* <Router>
        <Switch>
          <Route exact path="/" component={PageOne} />
        </Switch>
      </Router> */}
    </Container>
  );
}
