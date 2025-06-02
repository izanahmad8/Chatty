import joi from "joi";

const registerSchema = joi.object({
  fullName: joi.string().min(3).max(50).trim().required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should be at least 3 characters long",
    "string.max": "Name should not exceed 50 characters",
  }),

  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "in"] },
    })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email":
        "Enter a valid email with a supported domain (.com, .net, .org, .in)",
    }),

  password: joi
    .string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password should be at least 8 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
});

const loginSchema = joi.object({
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "in"] },
    })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email":
        "Enter a valid email with a supported domain (.com, .net, .org, .in)",
    }),
  password: joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should be at least 8 characters",
  }),
});

export { registerSchema, loginSchema };
