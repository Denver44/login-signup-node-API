/* eslint-disable no-unused-vars */
import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { createJWTToken } from '../utils/helper.js';
import sendEmail from '../utils/email.js';

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
  });

  const token = createJWTToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email & password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  const token = createJWTToken(user._id);

  return res.status(200).json({
    status: 'success',
    token,
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1.Get user based on POSTed email'

  const user = await User.findOne({ email: req.body.email });

  // Return Error if user Doesn't exist
  if (!user)
    return next(new AppError('There is no user with email address', 404));

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // This will Disable the Validation as we just need to reset Password for that no Validation is Required.

  // 3. Send it ito user email's
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your Password Sub,it a PATCH request with your new password and passwordConfirm to : ${resetURL}.\n If you didn't forgot your password. Please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token {valid for 10 min}',
      message,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please Try again later!',
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {});

export { signUp, login, forgotPassword, resetPassword };

// STEPS For Reset and Forgot Password

// 1. For Forgot Password A user will make a request to forgotPassword route with this email Id.
// So we will send
