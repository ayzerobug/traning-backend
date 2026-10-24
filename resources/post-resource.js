import { UserResource } from "./user-resource.js";

export class PostResource {
  static toJSON(post) {
    const responseObject = {
      id: post.id,
      title: post.title,
      body: post.body,
      createdAt: post.createdAt,
    };

    if (post.user) {
      responseObject.author = UserResource.toJSON(post.user);
    }

    return responseObject;
  }

  static collection(posts) {
    return posts.map((post) => this.toJSON(post));
  }
}
