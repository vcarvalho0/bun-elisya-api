import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
  Preview,
  Section
} from "@react-email/components";

type MailProps = {
  validationCode: string;
};

export const ResetPasswordCodeMail = ({ validationCode }: MailProps) => (
  <Html>
    <Head />
    <Preview>Reset Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your code to reset your password</Heading>
        <Text style={heroText}>
          Your confirmation code is below - enter it in your open browser window
          and we'll help you get signed in.
        </Text>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>{validationCode}</Text>
        </Section>

        <Text style={text}>
          If you didn't request this email, there's nothing to worry about, you
          can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordCodeMail;

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
};

const container = {
  margin: "0 auto",
  padding: "0px 20px"
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px"
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px"
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px"
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle"
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px"
};
