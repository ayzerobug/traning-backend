export class UserResource {
  static toJSON(user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  static collection(users) {
    return users.map((user) => this.toJSON(user));
  }
}