import AppError from "../errors/AppError.js";
import prisma from "../prisma/client.js";
import { UserResource } from "../resources/user-resource.js";

async function uploadAvatar(req, res) {
  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  const avatarPath = req.file.path;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { avatar: avatarPath },
  });

  res.json({
    success: true,
    message: "Avatar successfully uploaded",
    data: UserResource.toJSON(user),
  });
}

export default {
  uploadAvatar,
};
