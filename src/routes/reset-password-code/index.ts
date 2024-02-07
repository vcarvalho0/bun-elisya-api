import { prisma } from "@src/db";
import { hashPassword } from "@src/services/hash-password";
import { resend } from "@src/services/mail/client";
import ResetPasswordCodeMail from "@src/services/mail/templates/reset-passsword-mail";
import { generateOtp } from "@src/utils/generate-otp";
import dayjs from "dayjs";
import Elysia, { t } from "elysia";

export const otpRecoverPasswordRoute = new Elysia().post(
  "/recover-password",
  async ({ body }) => {
    const { email } = body;

    const findEmail = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (!findEmail) {
      throw new Error("Email not found");
    }

    await prisma.otp.delete({
      where: {
        userId: findEmail.id
      }
    });

    const otp = await generateOtp();

    resend.emails.send({
      from: "",
      to: email,
      subject: "[Forgot Password] You received a security code!",
      react: ResetPasswordCodeMail({
        validationCode: otp
      })
    });

    const hashOtp = await hashPassword(otp);

    const otpExpiresIn = dayjs().add(30, "seconds").toDate();

    await prisma.otp.create({
      data: {
        userId: findEmail.id,
        expiresIn: otpExpiresIn,
        otp: hashOtp
      }
    });

    return {
      email,
      hashOtp
    };
  },
  {
    body: t.Object({
      email: t.String()
    })
  }
);
