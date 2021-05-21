import { Button, Container, Row, Col, Form } from 'react-bootstrap';
// import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

// import PageOne from './PageOne';
import { useRef } from 'react';
import { Headline } from './App.style';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import firebase from 'firebase/app';

const { Group, Label, Control, Text, Check } = Form;

const { REACT_APP_CAPTCHA_KEY: captchaKey } = process.env;

type formValues = {
  fullName: string;
  email: string;
  optIn: boolean;
  timeStamp: Date;
};

export default function App() {
  const reCapRef = useRef<ReCAPTCHA>();
  const { register, handleSubmit } = useForm<formValues>();

  const signUp = handleSubmit(async ({ fullName, email, optIn }) => {
    try {
      const token = await reCapRef.current.executeAsync();
      console.log('token:', token);
      reCapRef.current.reset();

      const peopleCollection = firebase.firestore().collection('people');
      if (token) {
        await peopleCollection.add({
          fullName,
          email,
          optIn,
          timestamp: new Date(),
          token,
        });

        alert('Thank You!');
      } else {
        alert(
          'Try Again! You seem like a robot.. prove that you are human, by acting like one'
        );
      }
    } catch ({ message }) {
      console.error(message);
    }
  });

  return (
    <Container className="px-md-0 pt-5">
      <ReCAPTCHA sitekey={captchaKey} size="invisible" ref={reCapRef} />
      <Row>
        <Col className="text-center">
          <h1>Help Us Welcome Boris.</h1>
          <Headline>
            Boris Volynov is the last surviving member of the first group
            selected for human spaceflight.
          </Headline>
          <p>
            We love space, and as we move towards a bold future with missions to
            the Moon, Mars and beyond. It is important for us to remember where
            we came from. And the people who helped us get there.
          </p>
          <p>Sadly, the first generation of explorers is passing away.</p>
          INPUT GROUP CAPTCHA
          <Form onSubmit={signUp}>
            <Group controlId="formBasicInfo">
              <Row>
                <Form.Control
                  placeholder="Full Name"
                  {...register('fullName', { required: true })}
                />
              </Row>
            </Group>
            <Group controlId="formBasicEmail">
              <Label>Email address</Label>
              <Control
                type="email"
                placeholder="Enter email"
                {...register('email')}
              />
              <Text className="text-muted">
                We&apos;ll never share your email with anyone else.
              </Text>
            </Group>
            <Group controlId="formBasicCheckbox">
              <Check
                type="checkbox"
                label="Check me out"
                {...register('optIn')}
              />
            </Group>
            <Button variant="dark" type="submit">
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
