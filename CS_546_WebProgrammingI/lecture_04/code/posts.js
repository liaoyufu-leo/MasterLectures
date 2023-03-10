const mongoCollections = require('./mongoCollections');
const posts = mongoCollections.posts;
const dogs = require('./dogs');
const {ObjectId} = require('mongodb');

let exportedMethods = {
  async getPostById(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';

    const postCollection = await posts();
    const post = await postCollection.findOne({_id: ObjectId(id)});
    if (!post) throw 'No post with that id';

    return post;
  },
  async getAllPosts() {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    if (!postList) throw 'Could not get all posts';
    return postList;
  },
  async addPost(title, body, posterId) {
    if (!title) throw 'You must provide a title';
    if (typeof title !== 'string') throw 'Title must be a string';
    if (title.trim().length === 0)
      throw 'Title cannot be an empty string or just spaces';
    if (!body) throw 'You must provide a body';
    if (typeof body !== 'string') throw 'Body must be a string ';
    if (body.trim().length === 0)
      throw 'Body cannot be an empty string or just spaces';
    if (!posterId) throw 'You must specify a poster';
    if (typeof posterId !== 'string') throw 'posterId must be a string';
    if (posterId.trim().length === 0)
      throw 'PosterId cannot be an empty string or just spaces';
    if (!ObjectId.isValid(posterId)) throw 'posterId is not a valid Object ID';
    title = title.trim();
    body = body.trim();
    posterId = posterId.trim();

    const postCollection = await posts();
    const dogThatPosted = await dogs.getDogById(posterId);

    const newPostInfo = {
      title: title,
      body: body,
      poster: {
        id: posterId,
        name: dogThatPosted.name
      }
    };

    const insertInfo = await postCollection.insertOne(newPostInfo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add post';

    const newPost = await this.getPostById(insertInfo.insertedId.toString());

    return newPost;
  },
  async removePost(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';

    const postCollection = await posts();
    const deletionInfo = await postCollection.deleteOne({_id: ObjectId(id)});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }
    return {deleted: true};
  },
  async updatePost(id, title, body, posterId) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    if (!title) throw 'You must provide a title';
    if (typeof title !== 'string') throw 'Title must be a string';
    if (title.trim().length === 0)
      throw 'Title cannot be an empty string or just spaces';
    if (!body) throw 'You must provide a body';
    if (typeof body !== 'string') throw 'Body must be a string ';
    if (body.trim().length === 0)
      throw 'Body cannot be an empty string or just spaces';
    if (!posterId) throw 'You must specify a poster';
    if (typeof posterId !== 'string') throw 'posterId must be a string';
    if (posterId.trim().length === 0)
      throw 'PosterId cannot be an empty string or just spaces';
    if (!ObjectId.isValid(posterId)) throw 'posterId is not a valid Object ID';
    title = title.trim();
    body = body.trim();
    posterId = posterId.trim();

    const postCollection = await posts();
    const dogThatPosted = await dogs.getDogById(posterId);

    let updatedPost = {
      title: title,
      body: body,
      poster: {
        id: posterId,
        name: dogThatPosted.name
      }
    };

    const updatedInfo = await postCollection.replaceOne(
      {_id: ObjectId(id)},
      updatedPost
    );

    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update post successfully';
    }

    return await this.getPostById(id);
  }
};

module.exports = exportedMethods;
