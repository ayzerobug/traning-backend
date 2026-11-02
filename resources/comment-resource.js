import { UserResource } from "./user-resource.js";
import { PostResource } from "./post-resource.js";

export class CommentResource {
  static toJSON(comment) {
    const responseObject = {
      id: comment.id,
      body: comment.body,
      postId: comment.postId,
      createdAt: comment.createdAt,
    };

    if (comment.user) {
      responseObject.author = UserResource.toJSON(comment.user);
    }

    if (comment.post) {
      responseObject.post = PostResource.toJSON(comment.post);
    }

    return responseObject;
  }

  static collection(comments) {
    return comments.map((comment) => this.toJSON(comment));
  }
}
