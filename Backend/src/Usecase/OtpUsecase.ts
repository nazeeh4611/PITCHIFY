import { IEntrepreneurdata } from '../Domain/entities/entrepreneurentities';
import { IEntrepreneurRepository } from '../Domain/Interface/EntrepreneurInterface';
import { generateToken, generateRefreshToken } from '../Interface/Middleware/tokenauth';
import { OtpService } from '../Infrastructure/service/Otpservice';
class ApplicationError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class VerifyOtpUsecase {
  constructor(
    private entrepreneurRepository: IEntrepreneurRepository,
    private OtpSevice: { verifyOtp: (email: string, otp: number) => Promise<boolean> } 
  ) {}

  
  async execute(
    
    otp: number,
    email: string
  ): Promise<{ success: boolean; token?: string; refreshToken?: string; user?: IEntrepreneurdata }> {
    // Validate input

    console.log(otp,email,"this be the otp and email that getting in usecase")
    if (!otp || !email) {
      throw new ApplicationError("OTP and email are required", 400);
    }

    const isOtpValid = await this.OtpSevice.verifyOtp(email, otp);
    if (!isOtpValid) {
      throw new ApplicationError("Invalid or expired OTP", 401);
    }

    const entrepreneur = await this.entrepreneurRepository.findbyEmail(email);
    if (!entrepreneur || !entrepreneur._id) {
      throw new ApplicationError("No user found or invalid user data", 404);
    }

    await entrepreneur.save();

    const tokenPayload = { id: entrepreneur._id.toString(), email };
    const token = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);


    console.log(token,refreshToken,"opopoppopo")
    return {
      success: true,
      token,
      refreshToken,
      user: entrepreneur
    };
  }
}