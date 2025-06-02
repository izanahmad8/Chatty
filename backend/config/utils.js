import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    httpOnly: true, //prevent xss attacks
    secure: true,
    sameSite: "None", //prevent CSRF attacks when using strict mode
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
